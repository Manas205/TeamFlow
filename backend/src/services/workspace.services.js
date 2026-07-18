const mongoose=require('mongoose')
const Workspace=require('../models/workspace')
const Membership=require('../models/membership')
const User=require('../models/user')
const workspace = require('../models/workspace')
const createWorkspace=async({name,userId})=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try {
        const workspace=await Workspace.create([{name,owner:userId}],{session});
        await Membership.create(
            [
                {
                    user:userId,
                    workspace:workspace[0]._id,
                    role:'owner'
                }
            ],
            {
                session
            }
        )
        await session.commitTransaction();
        session.endSession();
        return workspace[0];
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err
    }
}

const getUserWorkspaces = async (userId) => {
  const memberships = await Membership.find({ user: userId }).populate('workspace');
  return memberships.map((m) => ({
    ...m.workspace.toObject(),
    role: m.role,
  }));
};
const inviteMember=async({workspaceId,email,requesterId})=>{
    const requesterMembership=await Membership.findOne({workspace:workspaceId,user:requesterId});
    if (!requesterMembership || requesterMembership.role !== 'owner') {
    const error = new Error('Only the workspace owner can invite members');
    error.statusCode = 403;
    throw error;
}
    const userToInvite = await User.findOne({ email });
  if (!userToInvite) {
    const error = new Error('No user found with this email');
    error.statusCode = 404;
    throw error;
  }
  const existingMembership = await Membership.findOne({ workspace: workspaceId, user: userToInvite._id });
  if (existingMembership) {
    const error = new Error('User is already a member of this workspace');
    error.statusCode = 409;
    throw error;
  }
   const membership = await Membership.create({
    user: userToInvite._id,
    workspace: workspaceId,
    role: 'member',
  });
  return membership;
};
// const getUserWorkspaces=async(userId)=>{
//     const memberships=await Membership.find({user:userId}).populate('workspace')
//     return memberships.map((m)=>({
//         ...m.workspace.toObject(),
//         role:m.role
//     }))
// }
module.exports={createWorkspace,getUserWorkspaces,inviteMember}
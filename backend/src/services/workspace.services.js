const mongoose=require('mongoose')
const Workspace=require('../models/Workspace')
const Membership=require('../models/membership')
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
// const getUserWorkspaces=async(userId)=>{
//     const memberships=await Membership.find({user:userId}).populate('workspace')
//     return memberships.map((m)=>({
//         ...m.workspace.toObject(),
//         role:m.role
//     }))
// }
module.exports={createWorkspace,getUserWorkspaces}
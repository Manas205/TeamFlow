const workspaceService=require('../services/workspace.services')
const createWorkspace=async(req,res)=>{
    try {
        const {name}=req.body;
        if(!name)
        {
            return res.status(400).json({message:"Workspace name is required"})
        }
        const workspace=await workspaceService.createWorkspace({
            name,
            userId:req.userId
        })
        return res.status(201).json({
      message: 'Workspace created successfully',
      workspace,
        });
    } catch (err) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
    }
}
const getUserWorkspace=async(req,res)=>{
    try {
        const workspaces = await workspaceService.getUserWorkspaces(req.userId);
        return res.status(200).json({ workspaces });
    } catch (err) {
        const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' })
    }
}
const inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const membership = await workspaceService.inviteMember({
      workspaceId,
      email,
      requesterId: req.userId,
    });
    return res.status(201).json({ message: 'Member added successfully', membership });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
};
module.exports = { createWorkspace, getUserWorkspace,inviteMember };
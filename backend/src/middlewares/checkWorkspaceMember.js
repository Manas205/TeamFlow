const Membership = require('../models/membership');
const checkWorkspaceMember=async(req,res,next)=>{
    const workspaceId=req.params.workspaceId || req.body.workspace;
    const membership=await Membership.findOne(
        {
            user:req.userId,
            workspace:workspaceId,
        }
    )
    if(!membership)
    {
        return res.status(403).json({message:"You are not a member of this workspace"})
    }
    req.membership=membership;
    next()
}
module.exports=checkWorkspaceMember
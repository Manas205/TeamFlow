const Board=require('../models/board')
const createBoard=async({name,workspaceId,userId})=>{
    const board=await Board.create({
        name,
        workspace:workspaceId,
        createdBy:userId,
    });
    return board;
}

const getBoards=async(workspaceId)=>{
    const boards=await Board.find({workspace:workspaceId})
    return boards
}
module.exports = { createBoard, getBoards };
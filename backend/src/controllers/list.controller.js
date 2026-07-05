const listService = require('../services/list.service');

const createList = async (req, res) => {
  try {
    const { name } = req.body;
    const { boardId } = req.params;
    if (!name) {
      return res.status(400).json({ message: 'List name is required' });
    }
    const list = await listService.createList({ name, boardId });
    return res.status(201).json({ message: 'List created successfully', list });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
};

const getLists = async (req, res) => {
  try {
    const { boardId } = req.params;
    const lists = await listService.getLists(boardId);
    return res.status(200).json({ lists });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
};
const moveList=async(req,res)=>{
  try {
      const {listId}=req.params;
      const {prevListId,nextListId}=req.body;
      const list=await listService.moveList({listId,prevListId,nextListId});
      return res.status(200).json({ message: 'List moved successfully', list });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      console.log("Error in move list controller");
      return res.status(statusCode).json({ message: err.message || 'Something went wrong' })
    }
}
const getListsWithCards=async(req,res)=>{
  try
  {
    const {boardId}=req.params;
    const lists=await listService.getListWithCards(boardId)
    
    return res.status(200).json({ lists });
  }catch(err)
  {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
}
module.exports = { createList, getLists, moveList,getListsWithCards };
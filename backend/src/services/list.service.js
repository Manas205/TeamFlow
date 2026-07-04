const List = require('../models/List');

const createList = async ({ name, boardId }) => {
  const lastList = await List.findOne({ board: boardId }).sort({ position: -1 });
  const position = lastList ? lastList.position + 1000 : 1000;

  const list = await List.create({ name, board: boardId, position });
  return list;
};

const getLists = async (boardId) => {
  const lists = await List.find({ board: boardId }).sort({ position: 1 });
  return lists;
};
const moveList=async({listId,prevListId,nextListId})=>{
  let newPosition;
  const prevList=prevListId ? await List.findById(prevListId) : null
  const nextList=nextListId ? await List.findById(nextListId) : null
  if(nextList && prevList)
  {
    newPosition=(prevList.position+nextList.position)/2;
  }else if(prevList && !nextList)
  {
    newPosition=prevList.position+1000
  }else if(!prevList && nextList)
  {
    newPosition=nextList.position/2;
  }else newPosition=1000
  const list=await List.findByIdAndUpdate(listId,{position:newPosition},{new:true})
  return list
}
module.exports = { createList, getLists, moveList };
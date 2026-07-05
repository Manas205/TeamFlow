const List = require('../models/List');
const Card=require('../models/card')
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
const getListWithCards=async(boardId)=>{
  const lists=await List.find({board:boardId}).sort({position:1}).lean();
  const listsWithCards=await Promise.all(
    lists.map(async(list)=>{
      const cards=await Card.find({list:list._id}).sort({position:1})
      return {...list,cards};
    })
  )
  return listsWithCards
}
module.exports = { createList, getLists, moveList,getListWithCards };
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

module.exports = { createList, getLists };
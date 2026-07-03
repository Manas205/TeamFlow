const boardService = require('../services/board.service');

const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const { workspaceId } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const board = await boardService.createBoard({ name, workspaceId, userId: req.userId });

    return res.status(201).json({ message: 'Board created successfully', board });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
};

const getBoards = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const boards = await boardService.getBoards(workspaceId);
    return res.status(200).json({ boards });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ message: err.message || 'Something went wrong' });
  }
};

module.exports = { createBoard, getBoards };
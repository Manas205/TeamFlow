const express = require('express');
const router = express.Router({ mergeParams: true }); 
const boardController = require('../controllers/board.controller');
const authenticate = require('../middlewares/authenticate');
const checkWorkspaceMember = require('../middlewares/checkWorkspaceMember');

router.post('/', authenticate, checkWorkspaceMember, boardController.createBoard);
router.get('/', authenticate, checkWorkspaceMember, boardController.getBoards);
router.use('/:boardId/lists',require('./list.routes'));
router.use('/:boardId/cards', require('./cardActions.routes'));
module.exports = router;
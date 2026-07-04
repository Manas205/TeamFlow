const express = require('express');
const router = express.Router({ mergeParams: true });
const listController = require('../controllers/list.controller');
const authenticate = require('../middlewares/authenticate');
const checkWorkspaceMember = require('../middlewares/checkWorkspaceMember');

router.post('/', authenticate, checkWorkspaceMember, listController.createList);
router.get('/', authenticate, checkWorkspaceMember, listController.getLists);
router.patch('/:listId/move', authenticate, checkWorkspaceMember, listController.moveList)
router.use('/:listId/cards',require('./card.routes'))
module.exports = router;
const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspace.controller');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, workspaceController.createWorkspace);
router.get('/', authenticate, workspaceController.getUserWorkspace);
router.use('/:workspaceId/boards', require('./board.routes'));
module.exports = router;
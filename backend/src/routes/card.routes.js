// src/routes/card.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const cardController = require('../controllers/card.controller');
const authenticate = require('../middlewares/authenticate');
const checkWorkspaceMember = require('../middlewares/checkWorkspaceMember');

router.post('/', authenticate, checkWorkspaceMember, cardController.createCard);
router.get('/', authenticate, checkWorkspaceMember, cardController.getCards);
module.exports = router;
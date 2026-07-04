const express = require('express');
const router = express.Router({ mergeParams: true });
const cardController = require('../controllers/card.controller');
const authenticate = require('../middlewares/authenticate');

router.patch('/:cardId/move', authenticate, cardController.moveCard);

module.exports = router;
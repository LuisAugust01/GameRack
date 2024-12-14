const express = require('express');
const { getGames, createGame } = require('../controllers/gameController');

const router = express.Router();

router.get('/', getGames);
router.post('/', createGame);

module.exports = router;
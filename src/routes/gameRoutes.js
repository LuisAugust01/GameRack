const express = require('express');
const { getGames, createGame } = require('../controllers/gameController');

const router = express.Router();

router.get('/get-all-games', getGames);
router.post('/update-game', createGame);

module.exports = router;
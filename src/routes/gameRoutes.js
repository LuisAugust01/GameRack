const express = require('express');
const { getGames, createGame } = require('../controllers/gameController');

const router = express.Router();

router.get('/', getGames); // Listar jogos
router.post('/', createGame); // Criar um jogo

module.exports = router;

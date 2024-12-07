const { readJson, writeJson } = require('../utils/jsonUtils');
const path = require('path');
const Game = require('../models/gameModel');

const gamesFilePath = path.join(__dirname, '../../data/game.json');

// Listar todos os jogos
const getGames = async (req, res) => {
    try {
        const games = await readJson(gamesFilePath);
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar jogos.', error });
    }
};

// Adicionar um novo jogo
const createGame = async (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ message: 'O nome do jogo é obrigatório.' });
    }

    try {
        const games = await readJson(gamesFilePath);
        const id = games.length + 1;

        const newGame = new Game(id, nome);
        games.push(newGame);

        await writeJson(gamesFilePath, games);
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar jogo.', error });
    }
};

module.exports = { getGames, createGame };

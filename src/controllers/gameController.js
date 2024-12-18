const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Game = require('../models/gameModel');
const { FILE_PATHS } = require('../config');

const gamesFilePath = path.resolve(__dirname, FILE_PATHS.GAMES);


const getGames = async (req, res) => {
    try {
        const games = await readJson(gamesFilePath);
        const formattedGames = games.map(game => ({
            id: game.id,
            nome: game.name
        }));
        res.status(200).json(formattedGames);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar jogos.', error });
    }
};

const createGame = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'O nome do jogo é obrigatório.' });
    }

    try {
        const games = await readJson(gamesFilePath);
        const id = games.length + 1;

        const newGame = new Game(id, name);
        games.push(newGame);

        await writeJson(gamesFilePath, games);
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar jogo.', error });
    }
};

module.exports = { getGames, createGame };
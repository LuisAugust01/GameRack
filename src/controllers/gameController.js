const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Game = require('../models/gameModel');
const { FILE_PATHS } = require('../config');

const gamesFilePath = path.resolve(__dirname, FILE_PATHS.GAMES);

const getGames = async (req, res) => {
    const { limite = 10, pagina = 1 } = req.query;

    const validLimits = [5, 10, 30];
    if (!validLimits.includes(Number(limite))) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30.' });
    }

    if (isNaN(pagina) || pagina < 1) {
        return res.status(400).json({ message: 'A página deve ser um número maior ou igual a 1.' });
    }

    try {
        const games = await readJson(gamesFilePath);
        const totalGames = games.length;

        const formattedGames = games.map(game => ({
            id: game.id,
            name: game.name
        }));

        const startIndex = (pagina - 1) * limite;
        const endIndex = startIndex + Number(limite);

        const paginatedGames = formattedGames.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalGames,
            limite: Number(limite),
            pagina: Number(pagina),
            totalPaginas: Math.ceil(totalGames / limite),
            dados: paginatedGames
        });
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

const updateGame = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'O nome do jogo é obrigatório.' });
    }

    try {
        const games = await readJson(gamesFilePath);
        const gameIndex = games.findIndex(game => game.id === parseInt(id));

        if (gameIndex === -1) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        games[gameIndex].name = name;

        await writeJson(gamesFilePath, games);
        res.status(200).json(games[gameIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar jogo.', error });
    }
};

const deleteGame = async (req, res) => {
    const { id } = req.params;

    try {
        const games = await readJson(gamesFilePath);
        const gameIndex = games.findIndex(game => game.id === parseInt(id));

        if (gameIndex === -1) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        const removedGame = games.splice(gameIndex, 1);

        await writeJson(gamesFilePath, games);
        res.status(200).json({ message: 'Jogo excluído com sucesso.', game: removedGame });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir jogo.', error });
    }
};

module.exports = { getGames, createGame, updateGame, deleteGame };

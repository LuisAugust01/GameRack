const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Game = require('../models/gameModel');
const { FILE_PATHS } = require('../config');

const gamesFilePath = path.resolve(__dirname, FILE_PATHS.GAMES);
const itemsFilePath = path.resolve(__dirname, FILE_PATHS.ITEMS);

// Função para listar jogos com paginação
const getGames = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;

    const validLimits = [5, 10, 30];
    if (!validLimits.includes(Number(limit))) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30.' });
    }

    if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: 'A página deve ser um número maior ou igual a 1.' });
    }

    try {
        const games = await readJson(gamesFilePath);
        const totalGames = games.length;

        const formattedGames = games.map(game => ({
            id: game.id,
            name: game.name
        }));

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + Number(limit);

        const pagedGames = formattedGames.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalGames,
            limit: Number(limit),
            page: Number(page),
            totalPages: Math.ceil(totalGames / limit),
            data: pagedGames
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar jogos.', error });
    }
};

// Função para criar um novo jogo
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

// Função para atualizar um jogo existente
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

// Função para excluir um jogo e seus itens relacionados
const deleteGame = async (req, res) => {
    const { id } = req.params;

    try {
        const games = await readJson(gamesFilePath);
        const items = await readJson(itemsFilePath);

        const gameIndex = games.findIndex(game => game.id === parseInt(id));

        if (gameIndex === -1) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        const removedGame = games.splice(gameIndex, 1);

        const filteredItems = items.filter(item => item.gameId !== parseInt(id));

        await writeJson(itemsFilePath, filteredItems);
        await writeJson(gamesFilePath, games);

        res.status(200).json({ message: 'Jogo e itens excluídos com sucesso.', game: removedGame });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir jogo e itens.', error });
    }
};

module.exports = { getGames, createGame, updateGame, deleteGame };

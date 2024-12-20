const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Item = require('../models/itemModel');
const { FILE_PATHS } = require('../config');

const itemsFilePath = path.resolve(__dirname, FILE_PATHS.ITEMS);
const gamesFilePath = path.resolve(__dirname, FILE_PATHS.GAMES);

// Função para buscar itens com paginação
const getItems = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;

    const validLimit = [5, 10, 30];
    if (!validLimit.includes(Number(limit))) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30.' });
    }

    if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: 'A página deve ser um número maior ou igual a 1.' });
    }

    try {
        const items = await readJson(itemsFilePath);
        const totalItems = items.length;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + Number(limit);

        const pagetedItems = items.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalItems,
            limit: Number(limit),
            page: Number(page),
            totalPaginas: Math.ceil(totalItems / limit),
            data: pagetedItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar itens.', error });
    }
};

// Função para criar um novo item
const createItem = async (req, res) => {
    const { gameName, type, name, quality, description, price, contact } = req.body;

    if (!gameName || !type || !name || !price || !contact) {
        return res.status(400).json({ 
            message: 'Os campos gameName, tipo, nome, preço e contato são obrigatórios.' 
        });
    }

    try {
        const games = await readJson(gamesFilePath);
        const game = games.find(game => game.name.toLowerCase() === gameName.toLowerCase());

        if (!game) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        const items = await readJson(itemsFilePath);
        const id = items.length + 1;

        const newItem = new Item(
            id,
            game.id,
            type,
            name,
            quality,
            description,
            price,
            contact,
            req.user.id
        );

        items.push(newItem);

        await writeJson(itemsFilePath, items);

        res.status(201).json({
            id: newItem.id,
            type: newItem.type,
            name: newItem.name,
            quality: newItem.quality,
            description: newItem.description,
            price: newItem.price,
            contact: newItem.contact,
            idGame: newItem.gameId,
            createdBy: newItem.createdBy
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar item.', error });
    }
};

// Função para atualizar um item existente
const updateItem = async (req, res) => {
    const { id } = req.params;
    const { type, name, quality, description, price, contact } = req.body;

    if (!type || !name || !price || !contact) {
        return res.status(400).json({ 
            message: 'Os campos tipo, nome, preço e contato são obrigatórios.' 
        });
    }

    try {
        const items = await readJson(itemsFilePath);
        const itemIndex = items.findIndex(item => item.id === parseInt(id));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        const gameId = items[itemIndex].gameId;
        const createdBy = req.user.id;

        items[itemIndex] = {
            ...items[itemIndex],
            type,
            name,
            quality,
            description,
            price,
            contact,
            createdBy,
            gameId
        };

        await writeJson(itemsFilePath, items);

        res.status(200).json(items[itemIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar item.', error });
    }
};

// Função para excluir um item
const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const items = await readJson(itemsFilePath);
        const itemIndex = items.findIndex(item => item.id === parseInt(id));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        const deletedItem = items.splice(itemIndex, 1);
        await writeJson(itemsFilePath, items);

        res.status(200).json({ message: 'Item excluído com sucesso.', deletedItem });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir item.', error });
    }
};

// Função para buscar itens de um jogo específico, filtrando por nome do jogo
const getItemsByGameName = async (req, res) => {
    const { gameName } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const validLimit = [5, 10, 30];
    if (!validLimit.includes(Number(limit))) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30.' });
    }

    if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: 'A página deve ser um número maior ou igual a 1.' });
    }

    try {
        const games = await readJson(gamesFilePath);
        const items = await readJson(itemsFilePath);

        const game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase());

        if (!game) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        const filteredItems = items.filter(item => item.gameId === game.id);

        if (filteredItems.length === 0) {
            return res.status(404).json({ message: 'Nenhum item encontrado para este jogo.' });
        }

        const totalItems = filteredItems.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + Number(limit);

        const pagetedItems = filteredItems.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalItems,
            limit: Number(limit),
            page: Number(page),
            totalPaginas: Math.ceil(totalItems / limit),
            data: pagetedItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar itens por nome do jogo.', error });
    }
};



module.exports = { getItems, createItem, updateItem, deleteItem, getItemsByGameName };
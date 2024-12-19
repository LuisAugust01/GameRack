const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Item = require('../models/itemModel');
const { FILE_PATHS } = require('../config');

const itemsFilePath = path.resolve(__dirname, FILE_PATHS.ITEMS);

const getItems = async (req, res) => {
    const { limite = 10, pagina = 1 } = req.query;

    // Validação de parâmetros
    const validLimits = [5, 10, 30];
    if (!validLimits.includes(Number(limite))) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30.' });
    }

    if (isNaN(pagina) || pagina < 1) {
        return res.status(400).json({ message: 'A página deve ser um número maior ou igual a 1.' });
    }

    try {
        const items = await readJson(itemsFilePath);
        const totalItems = items.length;

        // Cálculo de indices
        const startIndex = (pagina - 1) * limite;
        const endIndex = startIndex + Number(limite);

        // Retorna os itens paginados
        const paginatedItems = items.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalItems,
            limite: Number(limite),
            pagina: Number(pagina),
            totalPaginas: Math.ceil(totalItems / limite),
            dados: paginatedItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar itens.', error });
    }
};

const createItem = async (req, res) => {
    const { gameId, type, name, quality, description, price, contact, createdBy } = req.body;

    if (!gameId || !type || !name || !price || !contact || !createdBy) {
        return res.status(400).json({ 
            message: 'Os campos gameId, tipo, nome, preço, contato e createdBy são obrigatórios.' 
        });
    }

    try {
        const items = await readJson(itemsFilePath);
        const id = items.length + 1;

        const newItem = new Item(id, gameId, type, name, quality, description, price, contact, createdBy);
        items.push(newItem);

        await writeJson(itemsFilePath, items);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar item.', error });
    }
};

const updateItem = async (req, res) => {
    const { id } = req.params;
    const { gameId, type, name, quality, description, price, contact, createdBy } = req.body;

    if (!gameId || !type || !name || !price || !contact || !createdBy) {
        return res.status(400).json({ 
            message: 'Os campos gameId, tipo, nome, preço, contato e createdBy são obrigatórios.' 
        });
    }

    try {
        const items = await readJson(itemsFilePath);
        const itemIndex = items.findIndex(item => item.id === parseInt(id));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        items[itemIndex] = {
            ...items[itemIndex],
            gameId,
            type,
            name,
            quality,
            description,
            price,
            contact,
            createdBy
        };

        await writeJson(itemsFilePath, items);
        res.status(200).json(items[itemIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar item.', error });
    }
};

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

const getItemsByGameName = async (req, res) => {
    const { gameName } = req.params;
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
        const startIndex = (pagina - 1) * limite;
        const endIndex = startIndex + Number(limite);

        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalItems,
            limite: Number(limite),
            pagina: Number(pagina),
            totalPaginas: Math.ceil(totalItems / limite),
            dados: paginatedItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar itens por nome do jogo.', error });
    }
};



module.exports = { getItems, createItem, updateItem, deleteItem, getItemsByGameName };
const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Item = require('../models/itemModel');
const { FILE_PATHS } = require('../config');

const itemsFilePath = path.resolve(__dirname, FILE_PATHS.ITEMS);

const getItems = async (req, res) => {
    try {
        const items = await readJson(itemsFilePath);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar itens.', error });
    }
};

const createItem = async (req, res) => {
    const { gameId, tipo, nome, qualidade, descricao, preco, contato } = req.body;

    if (!gameId || !tipo || !nome || !preco || !contato) {
        return res.status(400).json({ message: 'Os campos gameId, tipo, nome, preço e contato são obrigatórios.' });
    }

    try {
        const items = await readJson(itemsFilePath);
        const id = items.length + 1;

        const newItem = new Item(id, gameId, tipo, nome, qualidade, descricao, preco, contato);
        items.push(newItem);

        await writeJson(itemsFilePath, items);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar item.', error });
    }
};

module.exports = { getItems, createItem };
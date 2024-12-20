const { readJson, writeJson } = require('../utils/jsonHandler');
const path = require('path');
const Item = require('../models/itemModel');
const { FILE_PATHS } = require('../config');

const itemsFilePath = path.resolve(__dirname, FILE_PATHS.ITEMS);
const gamesFilePath = path.resolve(__dirname, FILE_PATHS.GAMES);

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
    const { gameName, type, name, quality, description, price, contact } = req.body;

    // Verificando se os campos obrigatórios foram preenchidos
    if (!gameName || !type || !name || !price || !contact) {
        return res.status(400).json({ 
            message: 'Os campos gameName, tipo, nome, preço e contato são obrigatórios.' 
        });
    }

    try {
        // Lê o arquivo de jogos para encontrar o jogo pelo nome
        const games = await readJson(gamesFilePath);
        const game = games.find(game => game.name.toLowerCase() === gameName.toLowerCase());

        if (!game) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        const items = await readJson(itemsFilePath);
        const id = items.length + 1;

        // Criando o item com as informações fornecidas e preenchendo os dados que não são fornecidos
        const newItem = new Item(
            id,                           // ID do item
            game.id,                       // ID do jogo (procurado pelo nome)
            type,                          // Tipo do item
            name,                          // Nome do item
            quality,                       // Qualidade do item (opcional)
            description,                   // Descrição do item (opcional)
            price,                         // Preço do item
            contact,                       // Contato do item
            req.user.id                    // O ID do usuário logado (assumido que vem no req.user.id)
        );

        // Adicionando o novo item à lista de itens
        items.push(newItem);

        // Salvando os itens atualizados no arquivo
        await writeJson(itemsFilePath, items);

        // Respondendo com o novo item no formato desejado
        res.status(201).json({
            id: newItem.id,
            type: newItem.type,
            name: newItem.name,
            quality: newItem.quality,
            description: newItem.description,
            price: newItem.price,
            contact: newItem.contact,
            idGame: newItem.gameId,        // ID do jogo
            createdBy: newItem.createdBy   // ID do usuário que criou o item
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar item.', error });
    }
};

const updateItem = async (req, res) => {
    const { id } = req.params;
    const { type, name, quality, description, price, contact } = req.body;

    // Verifica se os campos obrigatórios foram preenchidos
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

        // Pega o ID do jogo atual e o ID do usuário logado
        const gameId = items[itemIndex].gameId;
        const createdBy = req.user.id; // Pega o ID do usuário logado (assumido que está em req.user.id)

        // Atualiza os dados do item, sem permitir a mudança do campo createdBy
        items[itemIndex] = {
            ...items[itemIndex],
            type,
            name,
            quality,
            description,
            price,
            contact,
            createdBy,  // Agora o createdBy vem automaticamente do ID do usuário
            gameId
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
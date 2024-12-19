const { readJson } = require('../utils/jsonHandler');
const path = require('path');
const { FILE_PATHS } = require('../config');

const itemsFilePath = path.resolve(__dirname, FILE_PATHS.ITEMS);

const verifyItemOwnershipMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.id; // O ID do usuário autenticado (definido no authenticateToken)
        const { id: itemId } = req.params; // O ID do item passado na rota

        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const items = await readJson(itemsFilePath);
        const item = items.find(item => item.id === parseInt(itemId, 10));

        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        if (item.createdBy !== userId) {
            return res.status(403).json({ message: 'Você não tem permissão para modificar este item.' });
        }

        next(); // Permite a continuação da requisição
    } catch (error) {
        console.error('Erro ao verificar propriedade do item:', error);
        return res.status(500).json({ message: 'Erro interno ao verificar propriedade do item.' });
    }
};

module.exports = { verifyItemOwnershipMiddleware };

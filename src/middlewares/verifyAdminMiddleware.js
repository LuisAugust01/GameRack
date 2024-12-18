const fs = require('fs').promises;
const path = require('path');
const { readJson } = require('../utils/jsonHandler');
const { FILE_PATHS } = require('../config');

const usersFilePath = path.resolve(__dirname, FILE_PATHS.USERS);

// O middleware precisa aceitar req, res, next
const verifyAdminMiddleware = async (req, res, next) => {
    try {
        const users = await readJson(usersFilePath);
        
        const adminExists = users.some(user => user.isAdmin);

        if (adminExists) {
            return res.status(400).json({ message: 'Administrador já existe.' });
        }

        next(); // Chama a próxima função no middleware
    } catch (error) {
        console.error('Erro ao verificar administrador:', error);
        return res.status(500).json({ message: 'Erro ao verificar administrador.' });
    }
};

module.exports = { verifyAdminMiddleware };
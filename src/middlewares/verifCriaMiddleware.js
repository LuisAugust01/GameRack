const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { readJson, writeJson } = require('../utils/jsonHandler');

const usersFilePath = path.join(__dirname, '../../data/user.json');

const createAdminIfNotExist = async () => {
    try {
        const users = await readJson(usersFilePath);
        
        const adminExists = users.some(user => user.isAdmin);

        if (!adminExists) {
            const id = `24-${users.length + 1111}`;
            const hashedPassword = await bcrypt.hash('adminPassword', 10);
            const newUser = new User(id, 'admin', hashedPassword, true);

            users.push(newUser);

            await writeJson(usersFilePath, users);

            console.log('Usuário administrador criado com sucesso!');
        } else {
            console.log('Usuário administrador já existe.');
        }
    } catch (error) {
        console.error("Erro ao verificar ou criar administrador:", error);
        throw error;
    }
};

module.exports = { createAdminIfNotExist };
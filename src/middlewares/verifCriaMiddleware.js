const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Certifique-se de que esse modelo está correto
const { readJson, writeJson } = require('../utils/jsonHandler'); // Funções para leitura e escrita no arquivo JSON

const usersFilePath = path.join(__dirname, '../../data/user.json');

const createAdminIfNotExist = async () => {
    try {
        const users = await readJson(usersFilePath);
        
        // Verifica se já existe um usuário administrador
        const adminExists = users.some(user => user.isAdmin);

        if (!adminExists) {
            // Caso não exista, cria um novo usuário admin
            const id = `24-${users.length + 1111}`; // Gerando ID com o formato desejado
            const hashedPassword = await bcrypt.hash('adminPassword', 10); // Senha padrão
            const newUser = new User(id, 'admin', hashedPassword, true); // Criação do usuário admin

            users.push(newUser);

            // Salva o usuário admin no arquivo
            await writeJson(usersFilePath, users);

            console.log('Usuário administrador criado com sucesso!');
        } else {
            console.log('Usuário administrador já existe.');
        }
    } catch (error) {
        console.error("Erro ao verificar ou criar administrador:", error);
        throw error; // Rethrow to ensure proper error handling
    }
};

module.exports = { createAdminIfNotExist };
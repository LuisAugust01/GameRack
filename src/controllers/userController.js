const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readJson, writeJson } = require('../utils/jsonHandler');
const User = require('../models/userModel');
const { FILE_PATHS } = require('../config');

const usersFilePath = path.resolve(__dirname, FILE_PATHS.USERS);

// Cadastrar um novo usuário
const registerUser = async (req, res) => {
    const { username, password, email, isAdmin = false } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, email e password são obrigatórios.' });
    }

    try {
        const users = await readJson(usersFilePath);

        if (users.some(user => user.username === username || user.email === email)) {
            return res.status(400).json({ message: 'Usuário ou email já existe.' });
        }

        const currentYear = new Date().getFullYear().toString().slice(-2);
        let lastIdNumber = 1111;

        if (users.length > 0) {
            const lastUserId = users[users.length - 1].id;
            const lastNumber = parseInt(lastUserId.split('-')[1], 10);
            lastIdNumber = lastNumber + 1;
        }

        const id = `${currentYear}-${lastIdNumber}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User(id, username, hashedPassword, isAdmin, email);
        users.push(newUser);

        await writeJson(usersFilePath, users);
        res.status(201).json({ message: 'Usuário registrado com sucesso.', user: { id, username, email, isAdmin } });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário.', error });
    }
};

const createAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email e password são obrigatórios.' });
    }

    try {
        const users = await readJson(usersFilePath);

        // Verifica se o email ou username já existem
        if (users.some(user => user.username === username || user.email === email)) {
            return res.status(400).json({ message: 'Usuário ou email já existem.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Gerar um novo ID
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const lastIdNumber = users.length > 0 
            ? parseInt(users[users.length - 1].id.split('-')[1], 10) + 1 
            : 1111;

        const id = `${currentYear}-${lastIdNumber}`;

        // Cria o novo administrador
        const newUser = new User(id, username, hashedPassword, true, email);
        users.push(newUser);

        await writeJson(usersFilePath, users);

        res.status(201).json({ 
            message: 'Administrador criado com sucesso.', 
            user: { id, username, email, isAdmin: true } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar administrador.', error });
    }
};

// Ver dados do usuário logado
const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const users = await readJson(usersFilePath);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json({ id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do usuário.', error });
    }
};

// Obter todos os usuários (apenas administradores)
const getAllUsers = async (req, res) => {
    const { limite = 10, pagina = 1 } = req.query;

    const validLimits = [5, 10, 30];
    if (!validLimits.includes(Number(limite))) {
        return res.status(400).json({ message: 'O limite deve ser 5, 10 ou 30.' });
    }

    if (isNaN(pagina) || pagina < 1) {
        return res.status(400).json({ message: 'A página deve ser um número maior ou igual a 1.' });
    }

    try {
        const users = await readJson(usersFilePath);

        // Remove as informações sensíveis (senha)
        const sanitizedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        }));

        const totalUsers = sanitizedUsers.length;
        const startIndex = (pagina - 1) * limite;
        const endIndex = startIndex + Number(limite);

        const paginatedUsers = sanitizedUsers.slice(startIndex, endIndex);

        res.status(200).json({
            total: totalUsers,
            limite: Number(limite),
            pagina: Number(pagina),
            totalPaginas: Math.ceil(totalUsers / limite),
            dados: paginatedUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os usuários.', error });
    }
};

// Atualizar dados do usuário
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const users = await readJson(usersFilePath);

        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = users[userIndex];

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        users[userIndex] = user;
        await writeJson(usersFilePath, users);

        res.json({ message: 'Usuário atualizado com sucesso.', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário.', error });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await readJson(usersFilePath);

        const user = users.find(u => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login realizado com sucesso.', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login.', error });
    }
};

// Excluir usuário
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const users = await readJson(usersFilePath);

        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        users.splice(userIndex, 1);

        await writeJson(usersFilePath, users);

        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário.', error });
    }
};


const createAdminIfNotExist = async () => {
    try {
        const users = await readJson(usersFilePath);

        const id = '24-1111';
        const hashedPassword = await bcrypt.hash('adminPassword', 10);
        const newAdmin = new User(id, 'admin', hashedPassword, true,'admin@example.com');

        users.push(newAdmin);
        await writeJson(usersFilePath, users);

        console.log('Administrador padrão criado com sucesso.');

    } catch (error) {
        console.error('Erro ao criar administrador:', error);
    }
};

const createAdminIfNotExistAuto = async () => {
    try {
        const users = await readJson(usersFilePath);
        const adminExists = users.some(user => user.isAdmin);

        if (!adminExists) {
            const id = `24-${users.length + 1111}`;
            const hashedPassword = await bcrypt.hash('adminPassword', 10);
            const newAdmin = new User(id, 'admin', hashedPassword, true,'admin@example.com');

            users.push(newAdmin);

            await writeJson(usersFilePath, users);

            console.log('Administrador criado com sucesso!');
        } else {
            console.log('Administrador já existe.');
        }
    } catch (error) {
        console.error('Erro ao verificar ou criar administrador:', error);
    }
};

module.exports = { registerUser, createAdmin, loginUser, getUserProfile, updateUser, deleteUser, getAllUsers, createAdminIfNotExist, createAdminIfNotExistAuto };
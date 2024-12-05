const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readJson, writeJson } = require('../utils/jsonHandler');
const User = require('../models/userModel');

const usersFilePath = path.join(__dirname, '../../data/user.json');

// Cadastrar um novo usuário
const registerUser = async (req, res) => {
    const { username, password, isAdmin = false } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username e password são obrigatórios.' });
    }

    try {
        const users = await readJson(usersFilePath);

        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: 'Usuário já existe.' });
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

        const newUser = new User(id, username, hashedPassword, isAdmin);
        users.push(newUser);

        await writeJson(usersFilePath, users);

        res.status(201).json({ message: 'Usuário registrado com sucesso.', user: { id, username, isAdmin } });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário.', error });
    }
};

// Criar administrador
const createAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await readJson(usersFilePath);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User(users.length + 1, username, hashedPassword, true);
        users.push(newUser);

        await writeJson(usersFilePath, users);

        res.status(201).json({ message: 'Administrador criado com sucesso.', user: { username } });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar administrador.', error });
    }
};

// Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await readJson(usersFilePath);
        const user = users.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login realizado com sucesso.', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login.', error });
    }
};

// Excluir usuário (apenas admin)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const users = await readJson(usersFilePath);
        const userIndex = users.findIndex(u => u.id === parseInt(id));

        if (userIndex === -1 || users[userIndex].isAdmin) {
            return res.status(400).json({ message: 'Usuário inválido ou administrador.' });
        }

        users.splice(userIndex, 1);
        await writeJson(usersFilePath, users);

        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário.', error });
    }
};

module.exports = { registerUser, loginUser, createAdmin, deleteUser };

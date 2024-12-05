const bcrypt = require('bcryptjs');
const { readJson, writeJson } = require('../utils/jsonHandler');
const filePath = './data/user.json';

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validação básica
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e senha são obrigatórios!' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Carrega e atualiza o JSON
        const users = await readJson(filePath);
        users.push({ id: Date.now(), username, password: hashedPassword, isAdmin: false });
        await writeJson(filePath, users);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
};

module.exports = { registerUser };

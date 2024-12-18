// Para validar se o e-mail e a senha foram fornecidos e se o e-mail tem um formato válido.

const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'E-mail inválido.' });
    }

    next();
};

module.exports = { validateLoginInput };
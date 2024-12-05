const verifyAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Apenas administradores podem realizar essa ação.' });
    }

    next();
};

module.exports = { verifyAdmin };
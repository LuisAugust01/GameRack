const authorizeUser = (req, res, next) => {
    const userId = req.user.id;
    const userToModifyId = req.params.id;

    // Se for um admin, ele pode alterar ou excluir qualquer usuário
    if (req.user.isAdmin) {
        return next();
    }

    // Se o usuário for o mesmo que está tentando alterar ou excluir
    if (userId === userToModifyId) {
        return next();
    }

    return res.status(403).json({ message: 'Você não tem permissão para modificar ou excluir este usuário.' });
};

module.exports = { authorizeUser };
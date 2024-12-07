const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const { createAdminIfNotExist } = require('./middlewares/verifCriaMiddleware');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/items', itemRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await createAdminIfNotExist();
        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (error) {
        console.error("Erro ao inicializar a verificação de administrador:", error);
    }
});
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const itemRoutes = require('./routes/itemRoutes');
const swaggerDocs = require('../swagger-output.json');
const swaggerExpress = require('swagger-ui-express');
const { createAdminIfNotExistAuto, createAdminIfNotExist } = require('../src/controllers/userController');
const { verifyAdminMiddleware } = require('../src/middlewares/verifyAdminMiddleware');
const { PORT } = require('../src/config');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/items', itemRoutes);
app.use('/docs',swaggerExpress.serve,swaggerExpress.setup(swaggerDocs));
app.get('/install', verifyAdminMiddleware, createAdminIfNotExist)

app.get('/', (req, res) => {
    res.send('Servidor funcionando! 🎉');
});

app.listen(PORT, async () => {
    try {
        await createAdminIfNotExistAuto();
        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (error) {
        console.error('Erro ao criar o administrador:', error);
    }
});
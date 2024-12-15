const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const itemRoutes = require('./routes/itemRoutes');
const { createAdminIfNotExist } = require('./middlewares/verifCriaMiddleware');
const swaggerDocs = require('../swagger-output.json');
const swaggerExpress = require('swagger-ui-express');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/items', itemRoutes);
app.use('/docs',swaggerExpress.serve,swaggerExpress.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.send('Servidor funcionando! 🎉');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await createAdminIfNotExist();
        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (error) {
        console.error("Erro ao inicializar a verificação de administrador:", error);
    }
});
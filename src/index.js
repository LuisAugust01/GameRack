require('dotenv').config(); // Carrega variáveis do arquivo .env
const express = require('express');
const app = express();

// Middleware para JSON
app.use(express.json());

// Rota inicial de teste
app.get('/', (req, res) => res.send('API funcionando!'));

// Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

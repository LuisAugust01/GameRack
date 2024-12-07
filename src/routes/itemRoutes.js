const express = require('express');
const { getItems, createItem } = require('../controllers/itemController');

const router = express.Router();

router.get('/', getItems); // Listar itens
router.post('/', createItem); // Criar um item

module.exports = router;

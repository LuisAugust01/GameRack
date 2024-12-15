const express = require('express');
const { getItems, createItem } = require('../controllers/itemController');

const router = express.Router();

router.get('/get-all-items', getItems);
router.post('/update-item', createItem);

module.exports = router;
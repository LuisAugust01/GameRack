const express = require('express');
const { getItems, createItem, updateItem, deleteItem, getItemsByGameName } = require('../controllers/itemController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { verifyItemOwnershipMiddleware } = require('../middlewares/verifyItemOwnershipMiddleware');

const router = express.Router();

router.get('/get-all-items', getItems);
router.post('/post-new-item', authenticateToken, createItem);
router.put('/update-item/:id', authenticateToken, verifyItemOwnershipMiddleware, updateItem);
router.delete('/delete-item/:id', authenticateToken, verifyItemOwnershipMiddleware, deleteItem);
router.get('/items/by-game-name/:gameName', getItemsByGameName);


module.exports = router;
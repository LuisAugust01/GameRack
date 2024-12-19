const express = require('express');
const { getGames, createGame, updateGame, deleteGame  } = require('../controllers/gameController');
const { authenticateToken } = require('../middlewares/authMiddleware')
const { verifyAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/get-all-games', getGames);
router.post('/post-new-game', authenticateToken, verifyAdmin, createGame);
router.put('/update-game/:id', authenticateToken, verifyAdmin, updateGame);
router.delete('/delete-game/:id', authenticateToken, verifyAdmin, deleteGame);

module.exports = router;
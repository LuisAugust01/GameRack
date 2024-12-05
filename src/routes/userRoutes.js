const express = require('express');
const { registerUser, loginUser, createAdmin, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create-admin', authenticateToken, verifyAdmin, createAdmin);
router.delete('/:id', authenticateToken, verifyAdmin, deleteUser);

module.exports = router;
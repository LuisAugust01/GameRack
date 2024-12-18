const express = require('express');
const { registerUser, updateUser, getUserProfile, loginUser, createAdmin, deleteUser, getAllUsers, createAdminIfNotExist } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/adminMiddleware');
const { validateLoginInput } = require('../middlewares/validateLoginInput');
const { verifyAdminMiddleware } = require('../middlewares/verifyAdminMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', validateLoginInput, loginUser);
router.post('/create-admin', authenticateToken, verifyAdmin, createAdmin);
router.delete('/delete-user/:id', authenticateToken, verifyAdmin, deleteUser);
router.put('/updateUser/:id', authenticateToken, verifyAdmin, updateUser);
router.get('/profile', authenticateToken, getUserProfile);
router.get('/all-profiles', authenticateToken, verifyAdmin, getAllUsers);
router.get('/install', verifyAdminMiddleware, createAdminIfNotExist);

module.exports = router;
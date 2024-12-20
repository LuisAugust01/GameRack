const express = require('express');
const { registerUser, updateUser, getUserProfile, loginUser, createAdmin, deleteUser, getAllUsers} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/adminMiddleware');
const { validateLoginInput } = require('../middlewares/validateLoginInput');
const { authorizeUser } = require('../middlewares/authorizeUserMiddleware')

const router = express.Router();

router.post('/register',validateLoginInput, registerUser);
router.post('/login', validateLoginInput, loginUser);
router.post('/create-admin', authenticateToken, verifyAdmin, validateLoginInput, createAdmin);
router.delete('/delete-user/:id', authenticateToken, authorizeUser, deleteUser);
router.put('/updateUser/:id', authenticateToken, authorizeUser, updateUser);
router.get('/profile', authenticateToken, getUserProfile);
router.get('/all-profiles', authenticateToken, verifyAdmin, getAllUsers);

module.exports = router;
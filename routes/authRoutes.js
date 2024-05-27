const express = require('express');
const { login, register, getUserInfo } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/user/me', authenticateToken, getUserInfo);

module.exports = router;

const express = require('express');
const { login, register, getUserInfo, searchOffices } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/offices', searchOffices);
router.get('/user/me', authenticateToken, getUserInfo);

module.exports = router;

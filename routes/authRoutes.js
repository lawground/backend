const express = require('express');
const { login, register, getUserInfo, searchOffices, getUsersByRoleAndOfficeHandler } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/offices', searchOffices);
router.get('/user/me', authenticateToken, getUserInfo);
router.get('/users', authenticateToken, getUsersByRoleAndOfficeHandler);


module.exports = router;
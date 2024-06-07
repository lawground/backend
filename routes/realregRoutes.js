const express = require('express');
const { getAllRealregsHandler, saveRealregHandler, getRealregsByIdHandler, updateRealregHandler, deleteRealregHandler } = require('../controllers/realregController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.get('/realregs', authenticateToken, getAllRealregsHandler);
router.get('/realregs/:realreg_id', authenticateToken, getRealregsByIdHandler);
router.post('/realregs', authenticateToken, saveRealregHandler);
router.put('/realregs/:realreg_id', authenticateToken, updateRealregHandler);
router.delete('/realregs/:realreg_id', authenticateToken, deleteRealregHandler);



module.exports = router;

const express = require('express');
const { saveReceiptHandler, getReceiptsByRealregIdHandler, deleteReceiptHandler, getReceiptByIdHandler } = require('../controllers/realregReceiptController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.post('/realregs/receipt/save', authenticateToken, saveReceiptHandler);
router.get('/realregs/receipts/:realreg_id', authenticateToken, getReceiptsByRealregIdHandler);
router.get('/realregs/receipts/reportpage/:receipt_id', authenticateToken, getReceiptByIdHandler);
router.delete('/realregs/receipts/:receipt_id', authenticateToken, deleteReceiptHandler);


module.exports = router;

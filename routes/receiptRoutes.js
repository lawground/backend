const express = require('express');
const { getReceiptsByLawsuitIdHandler, saveReceiptHandler, getReceiptByIdHandler, deleteReceiptHandler } = require('../controllers/receiptController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.get('/lawsuits/receipts/:id', authenticateToken, getReceiptsByLawsuitIdHandler);
router.post('/lawsuits/receipt/save', authenticateToken, saveReceiptHandler);
router.get('/lawsuits/receipts/reportpage/:receipt_id', authenticateToken, getReceiptByIdHandler);
router.delete('/lawsuits/receipts/:receipt_id', authenticateToken, deleteReceiptHandler);

module.exports = router;

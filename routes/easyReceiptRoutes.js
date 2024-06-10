const express = require('express');
const { getAllEasyReceiptsHandler, saveEasyReceiptHandler, getEasyReceiptByIdHandler, updateEasyReceiptByIdHandler, deleteEasyReceiptHandler} = require('../controllers/easyReceiptController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.get('/easyreceipts', authenticateToken, getAllEasyReceiptsHandler);
router.post('/easyreceipt/receipt/save', authenticateToken, saveEasyReceiptHandler);
router.get('/easyreceipt/:easyreceipt_id', authenticateToken, getEasyReceiptByIdHandler);
router.put('/easyreceipt/:easyreceipt_id', authenticateToken, updateEasyReceiptByIdHandler);
router.delete('/easyreceipt/receipt/:easyreceipt_id', authenticateToken, deleteEasyReceiptHandler);


module.exports = router;

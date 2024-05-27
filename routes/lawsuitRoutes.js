const express = require('express');
const { getAllLawsuitsHandler, addLawsuitHandler, getLawsuitByIdHandler, updateLawsuitHandler, deleteLawsuitHandler } = require('../controllers/lawsuitController');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

router.get('/lawsuits', authenticateToken, getAllLawsuitsHandler);
router.post('/lawsuits', authenticateToken, addLawsuitHandler);
router.get('/lawsuits/:id', authenticateToken, getLawsuitByIdHandler);
router.put('/lawsuits/:id', authenticateToken, updateLawsuitHandler);
router.delete('/lawsuits/:id', authenticateToken, deleteLawsuitHandler);


module.exports = router;

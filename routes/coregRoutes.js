const express = require('express');
const { getAllCompaniesHandler,
        getAllexecutivesHandler,
        getCompanyByIdHandler,
        getExecutivesByIdHandler,
        getShareholdersByIdHandler,
        getBranchofficesByIdHandler,
        saveCompanyHandler,
        saveExecutivesHandler,
        saveShareholdersHandler,
        saveBranchofficesHandler,
        updateCompanyByIDHandler,
        updateExecutivesByIDHandler,
        updateShareholdersByIDHandler,
        updateBranchofficesByIDHandler,
        deleteCompanyHandler,
    } = require('../controllers/coregController');
    
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

// 법인거래처 관련 라우터
router.get('/co', authenticateToken, getAllCompaniesHandler);
router.get('/executives', authenticateToken, getAllexecutivesHandler);


// id로 법인 거래처 불러오기
router.get('/co/:company_id', authenticateToken, getCompanyByIdHandler);
router.get('/co/:company_id/executives', authenticateToken, getExecutivesByIdHandler);
router.get('/co/:company_id/shareholders', authenticateToken, getShareholdersByIdHandler);
router.get('/co/:company_id/branchoffices', authenticateToken, getBranchofficesByIdHandler);

// 법인 거래처 작성
router.post('/co', authenticateToken, saveCompanyHandler);
router.post('/co/:company_id/executives', authenticateToken, saveExecutivesHandler);
router.post('/co/:company_id/shareholders', authenticateToken, saveShareholdersHandler);
router.post('/co/:company_id/branchoffices', authenticateToken, saveBranchofficesHandler);

// id로 법인 거래처 수정
router.put('/co/:company_id', authenticateToken, updateCompanyByIDHandler);
router.put('/co/:company_id/executives', authenticateToken, updateExecutivesByIDHandler);
router.put('/co/:company_id/shareholders', authenticateToken, updateShareholdersByIDHandler);
router.put('/co/:company_id/branchoffices', authenticateToken, updateBranchofficesByIDHandler);

// id로 법인 거래처 삭제
router.delete('/co/:company_id', authenticateToken, deleteCompanyHandler);

module.exports = router;

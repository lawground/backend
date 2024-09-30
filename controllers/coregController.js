const { 
  getAllcompanies,
  getAllexecutives,
  saveCompany,
  saveExecutives,
  saveShareholders,
  saveBranchoffices,
  getCompanyById,
  getExecutivesById,
  getShareholdersById,
  getBranchofficesById,
  updateCompany,
  updateExecutives,
  updateShareholders,
  updateBranchoffices,
  deleteCompany
} = require('../models/coregModel');
const { v4: uuidv4 } = require('uuid');


const getAllCompaniesHandler = async (req, res) => {
    const office_id = req.user.office_id;
    try {
        const companies = await getAllcompanies(office_id);
        res.json(companies);
    } catch (error) {
        console.error(`Error fetching companies: ${error.message}`);
        res.status(500).json({ message: '법인 정보를 불러오는 중에 오류가 발생했습니다.' });
    }
};

const getAllexecutivesHandler = async (req, res) => {
  const office_id = req.user.office_id;
  try {
      const executives = await getAllexecutives(office_id);
      res.json(executives);
  } catch (error) {
      console.error(`Error fetching executives: ${error.message}`);
      res.status(500).json({ message: '법인 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

// 법인 ID로 불러오기
const getCompanyByIdHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const office_id = req.user.office_id;

  try {
    const company = await getCompanyById(company_id, office_id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: '법인 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(`Error fetching company: ${error.message}`);
    res.status(500).json({ message: '법인 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

const getExecutivesByIdHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const office_id = req.user.office_id;

  try {
    const executives = await getExecutivesById(company_id, office_id);
    res.json(executives);
  } catch (error) {
    console.error(`Error fetching executives: ${error.message}`);
    res.status(500).json({ message: '임원 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

const getShareholdersByIdHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const office_id = req.user.office_id;

  try {
    const shareholders = await getShareholdersById(company_id, office_id);
    res.json(shareholders);
  } catch (error) {
    console.error(`Error fetching shareholders: ${error.message}`);
    res.status(500).json({ message: '주주 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

const getBranchofficesByIdHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const office_id = req.user.office_id;


  try {
    const branchoffices = await getBranchofficesById(company_id, office_id);
    res.json(branchoffices);
  } catch (error) {
    console.error(`Error fetching branchoffices: ${error.message}`);
    res.status(500).json({ message: '지점 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};


// 법인 거래처 저장하기
const saveCompanyHandler = async (req, res) => {
  const company = { ...req.body, company_id: uuidv4(), office_id: req.user.office_id };

  try {
    await saveCompany(company);
    res.status(201).json(company);
  } catch (error) {
    console.error(`Error adding company: ${error.message}`);
    res.status(500).json({ message: '법인 정보를 추가하는 중에 오류가 발생했습니다.' });
  }
};

const saveExecutivesHandler = async (req, res) => {
  const executives = { ...req.body, office_id: req.user.office_id, company_id: req.params.company_id };


  try {
    await saveExecutives(executives);
    res.status(201).json(executives);
  } catch (error) {
    console.error(`Error adding executives: ${error.message}`);
    res.status(500).json({ message: '임원 정보를 추가하는 중에 오류가 발생했습니다.' });
  }
};

const saveShareholdersHandler = async (req, res) => {
  const shareholders = { ...req.body, office_id: req.user.office_id, company_id: req.params.company_id };


  try {
    await saveShareholders(shareholders);
    res.status(201).json(shareholders);
  } catch (error) {
    console.error(`Error adding shareholders: ${error.message}`);
    res.status(500).json({ message: '주주 정보를 추가하는 중에 오류가 발생했습니다.' });
  }
};

const saveBranchofficesHandler = async (req, res) => {
  const branchoffices = { ...req.body, office_id: req.user.office_id, company_id: req.params.company_id };


  try {
    await saveBranchoffices(branchoffices);
    res.status(201).json(branchoffices);
  } catch (error) {
    console.error(`Error adding branchoffices: ${error.message}`);
    res.status(500).json({ message: '지점 정보를 추가하는 중에 오류가 발생했습니다.' });
  }
};


//법인 거래처 수정
const updateCompanyByIDHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const updatecompany = { ...req.body, company_id: company_id, office_id: req.user.office_id };

  
  try {
    await updateCompany(updatecompany);
    res.status(200).json(updatecompany);
  } catch (error) {
    console.error(`Error updating company: ${error.message}`);
    res.status(500).json({ message: '회사 정보를 업데이트하는 중에 오류가 발생했습니다.' });
  }
};

const updateExecutivesByIDHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const updateexecutives = { ...req.body, company_id: company_id, office_id: req.user.office_id };
  try {
    await updateExecutives(updateexecutives);
    res.status(200).json(updateexecutives);
  } catch (error) {
    console.error(`Error updating executives: ${error.message}`);
    res.status(500).json({ message: '임원 정보를 업데이트하는 중에 오류가 발생했습니다.' });
  }
};

const updateShareholdersByIDHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const updateshareholders = { ...req.body, company_id: company_id, office_id: req.user.office_id };
  try {
    await updateShareholders(updateshareholders);
    res.status(200).json(updateshareholders);
  } catch (error) {
    console.error(`Error updating shareholders: ${error.message}`);
    res.status(500).json({ message: '주주 정보를 업데이트하는 중에 오류가 발생했습니다.' });
  }
};

const updateBranchofficesByIDHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const updatebranchoffices = { ...req.body, company_id: company_id, office_id: req.user.office_id };
  try {
    await updateBranchoffices(updatebranchoffices);
    res.status(200).json(updatebranchoffices);
  } catch (error) {
    console.error(`Error updating branchoffices: ${error.message}`);
    res.status(500).json({ message: '지점 정보를 업데이트하는 중에 오류가 발생했습니다.' });
  }
};


// 법인 거래처 삭제
const deleteCompanyHandler = async (req, res) => {
  const company_id = req.params.company_id;
  const office_id = req.user.office_id;
  try {
    await deleteCompany(company_id, office_id);
    res.status(200).json({ message: '법인 정보가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(`Error deleting company: ${error.message}`);
    res.status(500).json({ message: '법인 정보를 삭제하는 중에 오류가 발생했습니다.' });
  }
};

module.exports = {
  getAllCompaniesHandler,
  getAllexecutivesHandler,
  saveCompanyHandler,
  saveExecutivesHandler,
  saveShareholdersHandler,
  saveBranchofficesHandler,
  getCompanyByIdHandler,
  getExecutivesByIdHandler,
  getShareholdersByIdHandler,
  getBranchofficesByIdHandler,
  updateCompanyByIDHandler,
  updateExecutivesByIDHandler,
  updateShareholdersByIDHandler,
  updateBranchofficesByIDHandler,
  deleteCompanyHandler,
};
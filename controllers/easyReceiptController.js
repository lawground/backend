const { getAllEasyReceipts, saveEasyReceipt, getEasyReceiptById , updateEasyReceiptById, deleteEasyReceipt} = require('../models/easyReceiptModel');
const { v4: uuidv4 } = require('uuid');


const getAllEasyReceiptsHandler = async (req, res) => {
    const office_id = req.user.office_id;
    try {
        const realregs = await getAllEasyReceipts(office_id);
        res.json(realregs);
    } catch (error) {
        console.error(`Error fetching realreg: ${error.message}`);
        res.status(500).json({ message: '간편영수증 정보를 불러오는 중에 오류가 발생했습니다.' });
    }
};

const saveEasyReceiptHandler = async (req, res) => {
    const easyreceipt = {...req.body, easyreceipt_id: uuidv4(), office_id: req.user.office_id, createdAt: new Date()}
    console.log(easyreceipt);
    try {
      await saveEasyReceipt(easyreceipt);
      res.status(200).json({ message: '영수증이 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error(`Error in saveReceiptHandler: ${error.message}`);
      res.status(500).json({ message: '영수증 정보를 저장하는 중에 오류가 발생했습니다.' });
    }
  };

  const getEasyReceiptByIdHandler = async (req, res) => {

    const easyreceipt_id = req.params.easyreceipt_id;
    const office_id = req.user.office_id;

    try {
      const easyreceipt = await getEasyReceiptById(easyreceipt_id, office_id);
      if (easyreceipt) {
        res.json(easyreceipt);
      } else {
        res.status(404).json({ message: '영수증 정보를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error(`Error in getReceiptByIdHandler: ${error.message}`);
      res.status(500).json({ message: '영수증 정보를 불러오는 중에 오류가 발생했습니다.' });
    }
  };

  const updateEasyReceiptByIdHandler = async (req, res) => {
    const easyreceipt_id = req.params.easyreceipt_id;
    const updatedeasyreceipt = { ...req.body, easyreceipt_id: easyreceipt_id, office_id: req.user.office_id };
    try {
      await updateEasyReceiptById(updatedeasyreceipt);
      res.status(200).json(updatedeasyreceipt);
    } catch (error) {
      console.error(`Error updating realreg: ${error.message}`);
      res.status(500).json({ message: '영수증 정보를 업데이트하는 중에 오류가 발생했습니다.' });
    }
  };

  const deleteEasyReceiptHandler = async (req, res) => {
    const easyreceipt_id = req.params.easyreceipt_id;
    const office_id = req.user.office_id;
    console.log(`Fetching realreg for easyreceipt_id: ${easyreceipt_id}, office_id: ${office_id}`);

    try {
      await deleteEasyReceipt(easyreceipt_id, office_id);
      res.status(200).json({ message: '부동산등기 정보가 성공적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(`Error deleting realreg: ${error.message}`);
      res.status(500).json({ message: '부동산등기 정보를 삭제하는 중에 오류가 발생했습니다.' });
    }
  };

module.exports = {
    getAllEasyReceiptsHandler,
    saveEasyReceiptHandler,
    getEasyReceiptByIdHandler,
    updateEasyReceiptByIdHandler,
    deleteEasyReceiptHandler
  };
  
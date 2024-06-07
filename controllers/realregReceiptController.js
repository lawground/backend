const { v4: uuidv4 } = require('uuid');
const { addReceipt, getAllReceipts, deleteReceipt, getReceiptById } = require('../models/realregReceiptModel');

const saveReceiptHandler = async (req, res) => {
  const { realreg_id, expensesLeft, expensesRight, VAT, LeftAmount, rightAmount, totalAmount, notes } = req.body;

  const receipt = {
    receipt_id: uuidv4(),
    realreg_id,
    expensesLeft,
    expensesRight,
    VAT,
    LeftAmount,
    rightAmount,
    totalAmount,
    notes,
    createdAt: new Date(),
    office_id: req.user.office_id
  };

  try {
    await addReceipt(receipt);
    res.status(200).json({ message: '영수증이 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error(`Error in saveReceiptHandler: ${error.message}`);
    res.status(500).json({ message: '영수증 정보를 저장하는 중에 오류가 발생했습니다.' });
  }
};

const getReceiptsByRealregIdHandler = async (req, res) => {
  const realreg_id = req.params.realreg_id;
  const office_id = req.user.office_id;

  try {
    const filteredReceipts = await getAllReceipts(realreg_id, office_id);
    res.json(filteredReceipts);
  } catch (error) {
    console.error(`Error in getReceiptsByRealregIdHandler: ${error.message}`);
    res.status(500).json({ message: '영수증 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

const deleteReceiptHandler = async (req, res) => {
  const receipt_id = req.params.receipt_id;
  const office_id = req.user.office_id;

  
  try {
    await deleteReceipt(receipt_id, office_id);

    res.status(200).json({ message: '영수증이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(`Error in deleteReceiptHandler: ${error.message}`);
    res.status(500).json({ message: '영수증 정보를 삭제하는 중에 오류가 발생했습니다.' });
  }
};

const getReceiptByIdHandler = async (req, res) => {
    const receipt_id = req.params.receipt_id;
    const office_id = req.user.office_id;
    try {
      const receipt = await getReceiptById(receipt_id, office_id);
      if (receipt) {
        res.json(receipt);
      } else {
        res.status(404).json({ message: '영수증 정보를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error(`Error in getReceiptByIdHandler: ${error.message}`);
      res.status(500).json({ message: '영수증 정보를 불러오는 중에 오류가 발생했습니다.' });
    }
  };


module.exports = {
  saveReceiptHandler,
  getReceiptsByRealregIdHandler,
  deleteReceiptHandler,
  getReceiptByIdHandler,
};

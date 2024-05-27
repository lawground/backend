const { v4: uuidv4 } = require('uuid');
const { getAllLawsuits, addLawsuit, getLawsuitById, updateLawsuit, deleteLawsuit } = require('../models/lawsuitModel');

const getAllLawsuitsHandler = async (req, res) => {
  const office_id = req.user.office_id;
  try {
    const lawsuits = await getAllLawsuits(office_id);
    res.json(lawsuits);
  } catch (error) {
    console.error(`Error fetching lawsuits: ${error.message}`);
    res.status(500).json({ message: '소송 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

const addLawsuitHandler = async (req, res) => {
  const lawsuit = { ...req.body, lawsuit_id: uuidv4(), office_id: req.user.office_id };
  try {
    await addLawsuit(lawsuit);
    res.status(201).json(lawsuit);
  } catch (error) {
    console.error(`Error adding lawsuit: ${error.message}`);
    res.status(500).json({ message: '소송 정보를 추가하는 중에 오류가 발생했습니다.' });
  }
};

const getLawsuitByIdHandler = async (req, res) => {
  const id = req.params.id;
  const office_id = req.user.office_id;
  try {
    const lawsuit = await getLawsuitById(id, office_id);
    if (lawsuit) {
      res.json(lawsuit);
    } else {
      res.status(404).json({ message: '소송 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(`Error fetching lawsuit by ID: ${error.message}`);
    res.status(500).json({ message: '소송 정보를 불러오는 중에 오류가 발생했습니다.' });
  }
};

const updateLawsuitHandler = async (req, res) => {
  const id = req.params.id;
  const updatedLawsuit = { ...req.body, lawsuit_id: id, office_id: req.user.office_id };
  try {
    await updateLawsuit(updatedLawsuit);
    res.status(200).json(updatedLawsuit);
  } catch (error) {
    console.error(`Error updating lawsuit: ${error.message}`);
    res.status(500).json({ message: '소송 정보를 업데이트하는 중에 오류가 발생했습니다.' });
  }
};

const deleteLawsuitHandler = async (req, res) => {
  const id = req.params.id;
  const office_id = req.user.office_id;
  try {
    await deleteLawsuit(id, office_id);
    res.status(200).json({ message: '소송 정보가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(`Error deleting lawsuit: ${error.message}`);
    res.status(500).json({ message: '소송 정보를 삭제하는 중에 오류가 발생했습니다.' });
  }
};

module.exports = {
  getAllLawsuitsHandler,
  addLawsuitHandler,
  getLawsuitByIdHandler,
  updateLawsuitHandler,
  deleteLawsuitHandler,
};

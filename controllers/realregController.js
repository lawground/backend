const { getAllRealregs, saveRealreg, getRealregsById, updateRealreg, deleteRealreg } = require('../models/realregModel');
const { v4: uuidv4 } = require('uuid');


const getAllRealregsHandler = async (req, res) => {
    const office_id = req.user.office_id;
    try {
        const realregs = await getAllRealregs(office_id);
        res.json(realregs);
    } catch (error) {
        console.error(`Error fetching realreg: ${error.message}`);
        res.status(500).json({ message: '부동산등기 정보를 불러오는 중에 오류가 발생했습니다.' });
    }
};

const saveRealregHandler = async (req, res) => {
    console.log(req.body);
    const realreg = {...req.body, realreg_id: uuidv4(), office_id: req.user.office_id }
    
    try{
        await saveRealreg(realreg);
        res.status(201).json(realreg);
    } catch (error) {
      console.error(`Error adding realreg: ${error.message}`);
      res.status(500).json({ message: '부동산정보를 추가하는 중에 오류가 발생했습니다.' });
    }
  };


  const getRealregsByIdHandler = async (req, res) => {
    const realreg_id = req.params.realreg_id;
    const office_id = req.user.office_id;
    console.log(`Fetching realreg for realreg_id: ${realreg_id}, office_id: ${office_id}`);
    try {
      const realreg = await getRealregsById(realreg_id, office_id);
      if (realreg) {
        res.json(realreg);
      } else {
        res.status(404).json({ message: '부동산등기 정보를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error(`Error in getRealregsByIdHandler: ${error.message}`);
      res.status(500).json({ message: '부동산등기 정보를 불러오는 중에 오류가 발생했습니다.' });
    }
  };

  const updateRealregHandler = async (req, res) => {
    const realreg_id = req.params.realreg_id;
    const updatedRealreg = { ...req.body, realreg_id: realreg_id, office_id: req.user.office_id };
    try {
      await updateRealreg(updatedRealreg);
      res.status(200).json(updatedRealreg);
    } catch (error) {
      console.error(`Error updating realreg: ${error.message}`);
      res.status(500).json({ message: '부동산등기 정보를 업데이트하는 중에 오류가 발생했습니다.' });
    }
  };

  const deleteRealregHandler = async (req, res) => {
    const realreg_id = req.params.realreg_id;
    const office_id = req.user.office_id;
    console.log(`Fetching realreg for realreg_id: ${realreg_id}, office_id: ${office_id}`);

    try {
      await deleteRealreg(realreg_id, office_id);
      res.status(200).json({ message: '부동산등기 정보가 성공적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(`Error deleting realreg: ${error.message}`);
      res.status(500).json({ message: '부동산등기 정보를 삭제하는 중에 오류가 발생했습니다.' });
    }
  };

module.exports = {
    getAllRealregsHandler,
    saveRealregHandler,
    getRealregsByIdHandler,
    updateRealregHandler,
    deleteRealregHandler,
  };
  
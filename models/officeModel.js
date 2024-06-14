const { masterPool } = require('../db');
const getOfficeByName = async (officeName) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_name = ?', [officeName]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getOfficeByName: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const getOfficeByOfficeId = async (office_id) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_id = ?', [office_id]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getOfficeByOfficeId: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const getOfficeByCode = async (officeCode) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_code = ?', [officeCode]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getOfficeByCode: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const searchOffice = async (searchQuery) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_name LIKE ?', [`%${searchQuery}%`]);
    return rows;
  } catch (error) {
    console.error(`Error in searchOffice: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getOfficeByName,
  getOfficeByCode,
  searchOffice,
  getOfficeByOfficeId,
};

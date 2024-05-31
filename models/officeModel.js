const { masterPool } = require('../db');

const getOfficeByName = async (officeName) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_name = ?', [officeName]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const getOfficeByCode = async (officeCode) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_code = ?', [officeCode]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const searchOffice = async (searchQuery) => {
  const conn = await masterPool.getConnection();

  try {
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_name LIKE ?', [`%${searchQuery}%`]);
    return rows;
  } finally {
    conn.release();
  }
};


module.exports = {
  getOfficeByName,
  getOfficeByCode,
  searchOffice,
};

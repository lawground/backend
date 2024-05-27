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

module.exports = {
  getOfficeByName,
};

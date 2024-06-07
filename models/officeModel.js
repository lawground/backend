const { masterPool } = require('../db');

const getOfficeByName = async (officeName) => {
  console.log('Connecting to database for getOfficeByName');
  const conn = await masterPool.getConnection();
  try {
    console.log(`Executing query: SELECT * FROM offices WHERE office_name = '${officeName}'`);
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_name = ?', [officeName]);
    console.log('Query executed successfully');
    return rows[0];
  } catch (error) {
    console.error(`Error in getOfficeByName: ${error.message}`);
    throw error;
  } finally {
    console.log('Releasing database connection for getOfficeByName');
    conn.release();
  }
};

const getOfficeByCode = async (officeCode) => {
  console.log('Connecting to database for getOfficeByCode');
  const conn = await masterPool.getConnection();
  try {
    console.log(`Executing query: SELECT * FROM offices WHERE office_code = '${officeCode}'`);
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_code = ?', [officeCode]);
    console.log('Query executed successfully');
    return rows[0];
  } catch (error) {
    console.error(`Error in getOfficeByCode: ${error.message}`);
    throw error;
  } finally {
    console.log('Releasing database connection for getOfficeByCode');
    conn.release();
  }
};

const searchOffice = async (searchQuery) => {
  console.log('Connecting to database for searchOffice');
  const conn = await masterPool.getConnection();
  try {
    console.log(`Executing query: SELECT * FROM offices WHERE office_name LIKE '%${searchQuery}%'`);
    const [rows] = await conn.query('SELECT * FROM offices WHERE office_name LIKE ?', [`%${searchQuery}%`]);
    console.log('Query executed successfully');
    return rows;
  } catch (error) {
    console.error(`Error in searchOffice: ${error.message}`);
    throw error;
  } finally {
    console.log('Releasing database connection for searchOffice');
    conn.release();
  }
};

module.exports = {
  getOfficeByName,
  getOfficeByCode,
  searchOffice,
};

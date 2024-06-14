const bcrypt = require('bcryptjs');
const { masterPool } = require('../db');

const getUserByUsername = async (username) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getUserByUsername: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const createUser = async (user) => {
  const conn = await masterPool.getConnection();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await conn.query(
      'INSERT INTO users (id, username, password, office_id, role, name, phone, email, number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, user.username, hashedPassword, user.office_id, user.role, user.name, user.phone, user.email, user.number]
    );

    return result;
  } catch (error) {
    console.error(`Error in createUser: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const getUsersByRoleAndOffice = async (role, officeId) => {
  const conn = await masterPool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE role = ? AND office_id = ?', [role, officeId]);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    conn.release();
  }
};



module.exports = {
  getUserByUsername,
  createUser,
  getUsersByRoleAndOffice,
};

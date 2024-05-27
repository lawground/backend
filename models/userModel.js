const bcrypt = require('bcrypt');
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
      'INSERT INTO users (id, username, password, office_id, role, name, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, user.username, hashedPassword, user.office_id, user.role, user.name, user.phone, user.email]
    );
    return result;
  } catch (error) {
    console.error(`Error in createUser: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getUserByUsername,
  createUser,
};

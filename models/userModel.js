const bcrypt = require('bcryptjs');
const { masterPool } = require('../db');

const getUserByUsername = async (username) => {
  console.log('Connecting to database for getUserByUsername');
  const conn = await masterPool.getConnection();
  try {
    console.log(`Executing query: SELECT * FROM users WHERE username = '${username}'`);
    const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('Query executed successfully');
    return rows[0];
  } catch (error) {
    console.error(`Error in getUserByUsername: ${error.message}`);
    throw error;
  } finally {
    console.log('Releasing database connection for getUserByUsername');
    conn.release();
  }
};

const createUser = async (user) => {
  console.log('Connecting to database for createUser');
  const conn = await masterPool.getConnection();
  try {
    console.log('Hashing password for createUser');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(`Executing query: INSERT INTO users (id, username, password, office_id, role, name, phone, email) VALUES (...)`);
    const result = await conn.query(
      'INSERT INTO users (id, username, password, office_id, role, name, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, user.username, hashedPassword, user.office_id, user.role, user.name, user.phone, user.email]
    );
    console.log('Query executed successfully');
    return result;
  } catch (error) {
    console.error(`Error in createUser: ${error.message}`);
    throw error;
  } finally {
    console.log('Releasing database connection for createUser');
    conn.release();
  }
};

module.exports = {
  getUserByUsername,
  createUser,
};

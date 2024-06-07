const mysql = require('mysql2/promise');

const masterPool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '1q2w3e4r..',
  database: 'masterdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

module.exports = {
  masterPool
};

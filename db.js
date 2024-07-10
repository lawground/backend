const mysql = require('mysql2/promise');

// 클라우드 접속
// const masterPool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   charset: 'utf8mb4'
// });

// 로컬 접속
const masterPool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '1q2w3e4r..',
  database: 'masterdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

masterPool.getConnection()
  .then(connection => {
    console.log('Database connection established');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = {
  masterPool
};

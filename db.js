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

const pools = {};

const getDatabaseName = (officeId) => {
  return `office${officeId}`;
};

const createOfficePool = (officeId) => {
  const dbName = getDatabaseName(officeId);
  if (!pools[dbName]) {
    console.log(`Creating new pool for database: ${dbName}`); // 디버깅 로그 추가
    pools[dbName] = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '1q2w3e4r..',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });
  } else {
    console.log(`Using existing pool for database: ${dbName}`); // 디버깅 로그 추가
  }
  return pools[dbName];
};

module.exports = {
  masterPool,
  createOfficePool
};

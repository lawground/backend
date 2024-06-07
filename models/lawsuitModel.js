const { masterPool } = require('../db');
const { format } = require('date-fns');

const getLawsuitTableName = (office_id) => `office${office_id}_lawsuits`;

const getAllLawsuits = async (office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getLawsuitTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE office_id = ? ORDER BY \`index\` DESC`, [office_id]);
    return rows.map(row => ({
      ...row,
      clients: JSON.parse(row.clients),
      opponents: JSON.parse(row.opponents),
      date: format(new Date(row.date), 'yyyy-MM-dd')
    }));
  } finally {
    conn.release();
  }
};

const getLastIndex = async (office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getLawsuitTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT MAX(\`index\`) AS lastIndex FROM ${tableName} WHERE office_id = ?`, [office_id]);
    return rows[0].lastIndex || 0;
  } finally {
    conn.release();
  }
};

const addLawsuit = async (lawsuit) => {
  const conn = await masterPool.getConnection();
  const tableName = getLawsuitTableName(lawsuit.office_id);
  try {
    const lastIndex = await getLastIndex(lawsuit.office_id);
    const newIndex = lastIndex + 1;

    const result = await conn.query(
      `INSERT INTO ${tableName} (\`index\`, lawsuit_id, office_id, clientType, clients, opponentType, opponents, date, caseName, court, manager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newIndex, lawsuit.lawsuit_id, lawsuit.office_id, lawsuit.clientType, JSON.stringify(lawsuit.clients), lawsuit.opponentType, JSON.stringify(lawsuit.opponents), lawsuit.date, lawsuit.caseName, lawsuit.court, lawsuit.manager]
    );
    return result;
  } finally {
    conn.release();
  }
};

const getLawsuitById = async (id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getLawsuitTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE lawsuit_id = ?`, [id]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        ...row,
        clients: JSON.parse(row.clients),
        opponents: JSON.parse(row.opponents),
        date: format(new Date(row.date), 'yyyy-MM-dd')
      };
    }
    return null; // 소송 정보를 찾지 못한 경우 null 반환
  } catch (error) {
    console.error(`Error in getLawsuitById: ${error.message}`);
    throw error; // 에러를 다시 던져서 상위 호출자가 처리할 수 있게 함
  } finally {
    conn.release();
  }
};

const updateLawsuit = async (lawsuit) => {
  const conn = await masterPool.getConnection();
  const tableName = getLawsuitTableName(lawsuit.office_id);
  try {
    const result = await conn.query(
      `UPDATE ${tableName} SET clientType = ?, clients = ?, opponentType = ?, opponents = ?, date = ?, caseName = ?, court = ?, manager = ? WHERE lawsuit_id = ?`,
      [lawsuit.clientType, JSON.stringify(lawsuit.clients), lawsuit.opponentType, JSON.stringify(lawsuit.opponents), lawsuit.date, lawsuit.caseName, lawsuit.court, lawsuit.manager, lawsuit.lawsuit_id]
    );
    return result;
  } finally {
    conn.release();
  }
};

const deleteLawsuit = async (id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getLawsuitTableName(office_id);
  try {
    const result = await conn.query(`DELETE FROM ${tableName} WHERE lawsuit_id = ?`, [id]);
    return result;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllLawsuits,
  addLawsuit,
  getLawsuitById,
  updateLawsuit,
  deleteLawsuit
};

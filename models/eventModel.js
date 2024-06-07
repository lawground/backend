const { masterPool } = require('../db');
const getEventTableName = (office_id) => `office${office_id}_events`;


const getAllEvents = async (office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getEventTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE office_id = ?`, [office_id]);
    return rows;
  } finally {
    conn.release();
  }
};

const createEvent = async (event) => {
  const { title, start, end, allDay, category, userRole, userName, office_id, color } = event;
  const conn = await masterPool.getConnection();
  const tableName = getEventTableName(office_id);
  try {
    const [result] = await conn.query(
      `INSERT INTO ${tableName} (title, start, end, allDay, category, userRole, userName, office_id, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, start, end, allDay, category, userRole, userName, office_id, color]
    );
    return result;
  } finally {
    conn.release();
  }
};

const updateEvent = async (id, event) => {
  const { title, start, end, allDay, category, userRole, userName, office_id, color } = event;
  const conn = await masterPool.getConnection();
  const tableName = getEventTableName(office_id);
  try {
    const [result] = await conn.query(
      `UPDATE ${tableName} SET title = ?, start = ?, end = ?, allDay = ?, category = ?, userRole = ?, userName = ?, office_id = ?, color = ? WHERE id = ?`,
      [title, start, end, allDay, category, userRole, userName, office_id, color, id]
    );
    return result;
  } finally {
    conn.release();
  }
};

const deleteEvent = async (id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getEventTableName(office_id);
  try {
    const [result] = await conn.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};

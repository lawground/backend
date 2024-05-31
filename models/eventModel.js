const { createOfficePool } = require('../db');

const getAllEvents = async (office_id) => {
  console.log('getAllEvents called with office_id:', office_id);
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM events WHERE office_id = ?', [office_id]);
    return rows;
  } finally {
    conn.release();
  }
};

const createEvent = async (event) => {

  const { title, start, end, allDay, category, userRole, userName, office_id, color } = event;
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  try {
    const [result] = await conn.query(
      'INSERT INTO events (title, start, end, allDay, category, userRole, userName, office_id, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, start, end, allDay, category, userRole, userName, office_id, color]
    );
    return result;
  } finally {
    conn.release();
  }
};

const updateEvent = async (id, event) => {
  console.log('updateEvent called with id:', id, 'and event:', event);
  const { title, start, end, allDay, category, userRole, userName, office_id, color } = event;
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  try {
    const [result] = await conn.query(
      'UPDATE events SET title = ?, start = ?, end = ?, allDay = ?, category = ?, userRole = ?, userName = ?, office_id = ?, color = ? WHERE id = ?',
      [title, start, end, allDay, category, userRole, userName, office_id, color, id]
    );
    console.log('Event updated with result:', result);
    return result;
  } finally {
    conn.release();
  }
};

const deleteEvent = async (id, office_id) => {
  console.log('deleteEvent called with id:', id, 'and office_id:', office_id);
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  try {
    const [result] = await conn.query('DELETE FROM events WHERE id = ?', [id]);
    console.log('Event deleted with result:', result);
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

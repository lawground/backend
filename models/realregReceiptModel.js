const { masterPool } = require('../db');
const { format } = require('date-fns');

const getReceiptTableName = (office_id) => `office${office_id}_realreg_receipts`;

const getAllReceipts = async (realreg_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getReceiptTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE realreg_id = ? ORDER BY createdAt DESC`, [realreg_id]);
    return rows.map(row => ({
      ...row,
      expensesLeft: JSON.parse(row.expensesLeft),
      expensesRight: JSON.parse(row.expensesRight),
      createdAt: format(new Date(row.createdAt), 'yy-MM-dd hh:mm:ss')
    }));
  } catch (error) {
    console.error(`Error in getAllReceipts: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const addReceipt = async (receipt) => {
  const conn = await masterPool.getConnection();
  const tableName = getReceiptTableName(receipt.office_id);
  try {
    const result = await conn.query(
      `INSERT INTO ${tableName} (receipt_id, realreg_id, expensesLeft, expensesRight, VAT, LeftAmount, rightAmount, totalAmount, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [receipt.receipt_id, receipt.realreg_id, JSON.stringify(receipt.expensesLeft), JSON.stringify(receipt.expensesRight), receipt.VAT, receipt.LeftAmount, receipt.rightAmount, receipt.totalAmount, receipt.notes, receipt.createdAt]
    );
    return result;
  } catch (error) {
    console.error(`Error in addReceipt: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const deleteReceipt = async (receipt_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getReceiptTableName(office_id);
  try {
    const result = await conn.query(`DELETE FROM ${tableName} WHERE receipt_id = ?`, [receipt_id]);
    return result;
  } catch (error) {
    console.error(`Error in deleteReceipt: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const getReceiptById = async (receipt_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getReceiptTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE receipt_id = ?`, [receipt_id]);
    if (rows.length > 0) {
      return {
        ...rows[0],
        expensesLeft: JSON.parse(rows[0].expensesLeft),
        expensesRight: JSON.parse(rows[0].expensesRight),
        createdAt: format(new Date(rows[0].createdAt), 'yyyy-MM-dd')
      };
    }
    return null;
  } catch (error) {
    console.error(`Error in getReceiptById: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllReceipts,
  addReceipt,
  deleteReceipt,
  getReceiptById
};

const mysql = require('mysql2/promise');
const { createOfficePool } = require('../db');
const { format } = require('date-fns');

const getAllReceipts = async (lawsuit_id, office_id) => {
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  console.log(`getAllReceipts: lawsuit_id=${lawsuit_id}, office_id=${office_id}`);
  try {
    const [rows] = await conn.query('SELECT * FROM receipts WHERE lawsuit_id = ? ORDER BY createdAt DESC', [lawsuit_id]);
    return rows.map(row => ({
      ...row,
      expensesLeft: JSON.parse(row.expensesLeft),
      expensesRight: JSON.parse(row.expensesRight),
      createdAt: format((row.createdAt), 'yy-MM-dd hh:mm:ss')
    }));
  } catch (error) {
    console.error(`Error in getAllReceipts: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const addReceipt = async (receipt) => {
  const officePool = createOfficePool(receipt.office_id);
  const conn = await officePool.getConnection();
  console.log('addReceipt:', receipt);
  try {
    const result = await conn.query(
      'INSERT INTO receipts (receipt_id, lawsuit_id, expensesLeft, expensesRight, VAT, LeftAmount, rightAmount, totalAmount, sub_content, notes, createdAt, courtprice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [receipt.receipt_id, receipt.lawsuit_id, JSON.stringify(receipt.expensesLeft), JSON.stringify(receipt.expensesRight), receipt.VAT, receipt.LeftAmount, receipt.rightAmount, receipt.totalAmount, receipt.sub_content, receipt.notes, receipt.createdAt, receipt.courtprice]
    );
    return result;
  } catch (error) {
    console.error(`Error in addReceipt: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const getReceiptById = async (receipt_id, office_id) => {
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  console.log(`getReceiptById: receipt_id=${receipt_id}, office_id=${office_id}`);
  try {
    const [rows] = await conn.query('SELECT * FROM receipts WHERE receipt_id = ?', [receipt_id]);
    if (rows.length > 0) {
      return {
        ...rows[0],
        expensesLeft: JSON.parse(rows[0].expensesLeft),
        expensesRight: JSON.parse(rows[0].expensesRight),
        createdAt: format((rows[0].createdAt), 'yyyy-MM-dd')

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

const deleteReceipt = async (receipt_id, office_id) => {
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  console.log(`deleteReceipt: receipt_id=${receipt_id}, office_id=${office_id}`);
  try {
    const result = await conn.query('DELETE FROM receipts WHERE receipt_id = ?', [receipt_id]);
    return result;
  } catch (error) {
    console.error(`Error in deleteReceipt: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllReceipts,
  addReceipt,
  getReceiptById,
  deleteReceipt
};

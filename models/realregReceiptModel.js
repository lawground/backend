const mysql = require('mysql2/promise');
const { createOfficePool } = require('../db');
const { format } = require('date-fns');

const getAllReceipts = async (realreg_id, office_id) => {
  const officePool = createOfficePool(office_id);
  const conn = await officePool.getConnection();
  
  try {
    const [rows] = await conn.query('SELECT * FROM realreg_receipts WHERE realreg_id = ? ORDER BY createdAt DESC', [realreg_id]);
    
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
  
  try {
    const result = await conn.query(
      'INSERT INTO realreg_receipts (receipt_id, realreg_id, expensesLeft, expensesRight, VAT, LeftAmount, rightAmount, totalAmount, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    const officePool = createOfficePool(office_id);
    const conn = await officePool.getConnection();
    try {
      const result = await conn.query('DELETE FROM realreg_receipts WHERE receipt_id = ?', [receipt_id]);
      return result;
    } catch (error) {
      console.error(`Error in deleteReceipt: ${error.message}`);
      throw error;
    } finally {
      conn.release();
    }
  };


  const getReceiptById = async (receipt_id, office_id) => {
    const officePool = createOfficePool(office_id);
    const conn = await officePool.getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM realreg_receipts WHERE receipt_id = ?', [receipt_id]);
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

module.exports = {
  getAllReceipts,
  addReceipt,
  deleteReceipt,
  getReceiptById
};

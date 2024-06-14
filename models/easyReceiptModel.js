const { masterPool } = require('../db');
const { format } = require('date-fns');

const getEasyReceiptTableName = (office_id) => `office${office_id}_easyreceipts`;

const getAllEasyReceipts = async (office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getEasyReceiptTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE office_id = ? ORDER BY createdAt DESC`, [office_id]);
    return rows.map(row => ({
      ...row,
      registration_date: format(new Date(row.registration_date), 'yyyy-MM-dd'),
    }));
  } finally {
    conn.release();
  }
};

const saveEasyReceipt = async (easyreceipt) => {
    const conn = await masterPool.getConnection();
    const tableName = getEasyReceiptTableName(easyreceipt.office_id);
    try {
      const result = await conn.query(
        `INSERT INTO ${tableName} (easyreceipt_id, office_id, division1, division2, requester, price, registration_date, manager, memo, expensesLeft, expensesRight, VAT, LeftAmount, rightAmount, totalAmount, lastTotalAmount, paymentStatus, taxInvoiceStatus, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [easyreceipt.easyreceipt_id, easyreceipt.office_id, easyreceipt.division1, easyreceipt.division2, easyreceipt.requester, easyreceipt.price, easyreceipt.registration_date, easyreceipt.manager, easyreceipt.memo, JSON.stringify(easyreceipt.expensesLeft), JSON.stringify(easyreceipt.expensesRight), easyreceipt.VAT, easyreceipt.LeftAmount, easyreceipt.rightAmount, easyreceipt.totalAmount, easyreceipt.lastTotalAmount, easyreceipt.paymentStatus, easyreceipt.taxInvoiceStatus, easyreceipt.createdAt ]
      );
      return result;
    } catch (error) {
      console.error(`Error in addReceipt: ${error.message}`);
      throw error;
    } finally {
      conn.release();
    }
  };

  const getEasyReceiptById = async (easyreceipt_id, office_id) => {
    const conn = await masterPool.getConnection();
    const tableName = getEasyReceiptTableName(office_id);
    try {
      const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE easyreceipt_id = ?`, [easyreceipt_id]);
      if (rows.length > 0) {
        return {
          ...rows[0],
          expensesLeft: JSON.parse(rows[0].expensesLeft),
          expensesRight: JSON.parse(rows[0].expensesRight),
          registration_date: format(new Date(rows[0].registration_date), 'yyyy-MM-dd'),

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

  const updateEasyReceiptById = async (easyreceipt) => {
    const conn = await masterPool.getConnection();
    const tableName = getEasyReceiptTableName(easyreceipt.office_id);
    
    try {
      const result = await conn.query(
        `UPDATE ${tableName} SET division1 = ?, division2 = ?, requester = ?, price = ?, registration_date = ?, manager = ?, memo = ?, expensesLeft = ?, expensesRight = ?, VAT = ?, LeftAmount = ?, rightAmount = ?, totalAmount = ?, lastTotalAmount = ?, paymentStatus = ?, taxInvoiceStatus = ?, createdAt = ? WHERE easyreceipt_id = ?`,
        [easyreceipt.division1, easyreceipt.division2, easyreceipt.requester, easyreceipt.price, easyreceipt.registration_date, easyreceipt.manager, easyreceipt.memo, JSON.stringify(easyreceipt.expensesLeft), JSON.stringify(easyreceipt.expensesRight), easyreceipt.VAT, easyreceipt.LeftAmount, easyreceipt.rightAmount, easyreceipt.totalAmount, easyreceipt.lastTotalAmount, easyreceipt.paymentStatus, easyreceipt.taxInvoiceStatus, easyreceipt.createdAt, easyreceipt.easyreceipt_id]
      );
      return result;
    } finally {
      conn.release();
    }
  };

  const deleteEasyReceipt = async (easyreceipt_id, office_id) => {
    const conn = await masterPool.getConnection();
    const tableName = getEasyReceiptTableName(office_id);
    try {
      const result = await conn.query(`DELETE FROM ${tableName} WHERE easyreceipt_id = ?`, [easyreceipt_id]);
      return result;
    } finally {
      conn.release();
    }
  };

module.exports = {
    getAllEasyReceipts,
    saveEasyReceipt,
    getEasyReceiptById,
    updateEasyReceiptById,
    deleteEasyReceipt,
  };
  
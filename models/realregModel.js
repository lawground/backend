const mysql = require('mysql2/promise');
const { createOfficePool } = require('../db');
const { format } = require('date-fns');

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${period} ${formattedHours.toString().padStart(2, '0')}:${minutes}`;
};

const getAllRealregs = async (office_id) => {
    const officePool = createOfficePool(office_id);
    const conn = await officePool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM realregs WHERE office_id = ?', [office_id]);
        return rows.map(row => ({
            ...row,
            registration_date: format(new Date(row.registration_date), 'yyyy-MM-dd'),
            contract_date: format(new Date(row.contract_date), 'yyyy-MM-dd'),
            settlement_date: format(new Date(row.settlement_date), 'yyyy-MM-dd'),
            settlement_date: format(new Date(row.settlement_date), 'yyyy-MM-dd'),
            settlement_time: formatTime(row.settlement_time)
          }));
    } finally {
        conn.release();
    }
};

const getLastIndex = async (office_id) => {
    const officePool = createOfficePool(office_id);
    const conn = await officePool.getConnection();
    try {
      const [rows] = await conn.query('SELECT MAX(`index`) AS lastIndex FROM realregs WHERE office_id = ?', [office_id]);
      return rows[0].lastIndex || 0;
    } finally {
      conn.release();
    }
  };


const saveRealreg = async (realreg) => {
    const officePool = createOfficePool(realreg.office_id);
    const conn = await officePool.getConnection();
    try {
        const lastIndex = await getLastIndex(realreg.office_id);
        const newIndex = lastIndex + 1;

        const result = await conn.query(
            'INSERT INTO realregs (`index`,realreg_id, office_id, requester, division, registration_date, contract_date, settlement_date, settlement_time, repayment_status, sell_price, public_price, transaction_address, buyer, buyer_number, buyer_address, manager, effect, seller, seller_number, seller_address, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newIndex, realreg.realreg_id, realreg.office_id, realreg.requester, realreg.division, realreg.registration_date, realreg.contract_date, realreg.settlement_date, realreg.settlement_time, realreg.repayment_status, realreg.sell_price, realreg.public_price, realreg.transaction_address, realreg.buyer, realreg.buyer_number, realreg.buyer_address, realreg.manager, realreg.effect, realreg.seller, realreg.seller_number, realreg.seller_address, realreg.memo]
        );
        return [result];

    } finally {
        conn.release();
    }
};

const getRealregsById = async (realreg_id, office_id) => {
    const officePool = createOfficePool(office_id);
    const conn = await officePool.getConnection();
    try {
      const [rows] = await conn.query('SELECT * FROM realregs WHERE realreg_id = ?', [realreg_id]);
      if (rows.length > 0) {
        return {
          ...rows[0],
          registration_date: format(new Date(rows[0].registration_date), 'yyyy-MM-dd'),
          contract_date: format(new Date(rows[0].contract_date), 'yyyy-MM-dd'),
          settlement_date: format(new Date(rows[0].settlement_date), 'yyyy-MM-dd'),
        };
      }
      return null;
    } catch (error) {
      console.error(`Error in getRealregsById: ${error.message}`);
      throw error;
    } finally {
      conn.release();
    }
  };

  const updateRealreg = async (realreg) => {
    const officePool = createOfficePool(realreg.office_id);
    const conn = await officePool.getConnection();
    try {
      const result = await conn.query(
        'UPDATE realregs SET requester = ?, division = ?, contract_date = ?, settlement_date = ?, settlement_time = ?, repayment_status = ?, sell_price = ?, public_price = ?, transaction_address = ?, buyer = ?, buyer_number = ?, buyer_address = ?, manager = ?, effect = ?, seller = ?, seller_number = ?, seller_address = ?, memo = ?  WHERE realreg_id = ?',
        [realreg.requester, realreg.division, realreg.contract_date, realreg.settlement_date, realreg.settlement_time, realreg.repayment_status, realreg.sell_price, realreg.public_price, realreg.transaction_address, realreg.buyer, realreg.buyer_number, realreg.buyer_address, realreg.manager, realreg.effect, realreg.seller, realreg.seller_number, realreg.seller_address, realreg.memo, realreg.realreg_id]
      );
      return result;
    } finally {
      conn.release();
    }
  };

  const deleteRealreg = async (realreg_id, office_id) => {
    const officePool = createOfficePool(office_id);
    const conn = await officePool.getConnection();
    try {
      const result = await conn.query('DELETE FROM realregs WHERE realreg_id = ?', [realreg_id]);
      return result;
    } finally {
      conn.release();
    }
  };

module.exports = {
    getAllRealregs,
    saveRealreg,
    getRealregsById,
    updateRealreg,
    deleteRealreg,
};

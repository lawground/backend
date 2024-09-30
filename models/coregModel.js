const { masterPool } = require('../db');
const { format } = require('date-fns');

const getCompaniseTableName = (office_id) => `office${office_id}_companies`;
const getExecutivesTableName = (office_id) => `office${office_id}_executives`;
const getShareholdersTableName = (office_id) => `office${office_id}_shareholders`;
const getBranchofficesTableName = (office_id) => `office${office_id}_branchoffices`;

const getAllcompanies = async (office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getCompaniseTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE office_id = ?`, [office_id]);
    return rows.map(row => ({
      ...row,
      reg_date: format(new Date(row.reg_date), 'yyyy-MM-dd'),
    }));
  } finally {
    conn.release();
  }
};

const getAllexecutives = async (office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getExecutivesTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName}`);
    return rows.map(row => ({
      ...row,
      reg_date: format(new Date(row.reg_date), 'yyyy-MM-dd'),
    }));
  } finally {
    conn.release();
  }
};

const saveCompany = async (company) => {
  const conn = await masterPool.getConnection();
  const tableName = getCompaniseTableName(company.office_id);

  const sql = `
    INSERT INTO ${tableName} (
      company_id,
      office_id,
      requester,
      co_category,
      custom_co_category,
      reg_number,
      co_number,
      category_rocation,
      co_name,
      eng_name,
      reg_date,
      co_address,
      announcement,
      stock_price,
      stock_total_amount,
      stock_amount,
      capital,
      purpose,
      manager,
      manager_mail,
      manager_tel,
      branchoffice_active,
      co_settlement_month,
      co_period,
      co_custom_period
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    company.company_id,
    company.office_id,
    company.requester,
    company.co_category,
    company.custom_co_category,
    company.reg_number,
    company.co_number,
    company.category_rocation,
    company.co_name,
    company.eng_name,
    company.reg_date,
    company.co_address,
    company.announcement,
    company.stock_price,
    company.stock_total_amount,
    company.stock_amount,
    company.capital,
    company.purpose,
    company.manager,
    company.manager_mail,
    company.manager_tel,
    company.branchoffice_active ? 1 : 0, // true/false를 1/0으로 변환
    company.co_settlement_month,
    company.co_period,
    company.co_custom_period
  ];

  try {
    const result = await conn.query(sql, values);
    return result;
  } finally {
    conn.release();
  }
};

const saveExecutives = async (executiveData) => {
  const conn = await masterPool.getConnection();
  const tableName = getExecutivesTableName(executiveData.office_id);


  const sql = `
    INSERT INTO ${tableName} (
      company_id,
      role,
      name,
      number,
      reg_date,
      address, 
      representation
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    for (const executives of executiveData.executives) {
      const values = [
        executiveData.company_id,
        executives.role,
        executives.name,
        executives.number,
        executives.reg_date,
        executives.address,
        executives.representation ? 1 : 0 // true/false를 1/0으로 변환
      ];
      await conn.query(sql, values);
    }
    return { message: 'All executives saved successfully' };
  } catch (error) {
    console.error(`Error saving executives: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const saveShareholders = async (shareholderData) => {
  const conn = await masterPool.getConnection();
  const tableName = getShareholdersTableName(shareholderData.office_id);

  const sql = `
    INSERT INTO ${tableName} (
      company_id,
      name,
      number,
      stockamount,
      address
    ) VALUES (?, ?, ?, ?, ?)
  `;

  try {
    for (const shareholder of shareholderData.shareholders) {
      const values = [
        shareholderData.company_id,
        shareholder.name,
        shareholder.number,
        shareholder.stockamount,
        shareholder.address
      ];
      await conn.query(sql, values);
    }
    return { message: 'All shareholders saved successfully' };
  } catch (error) {
    console.error(`Error saving shareholders: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const saveBranchoffices = async (branchofficesData) => {
  const conn = await masterPool.getConnection();
  const tableName = getBranchofficesTableName(branchofficesData.office_id);

  const sql = `
    INSERT INTO ${tableName} (
      company_id,
      name,
      reg_date,
      address
    ) VALUES (?, ?, ?, ?)
  `;

  try {
    for (const branchoffices of branchofficesData.branchoffices) {
      const values = [
        branchofficesData.company_id,
        branchoffices.name,
        branchoffices.reg_date,
        branchoffices.address
      ];
      await conn.query(sql, values);
    }
    return { message: 'All branchoffices saved successfully' };
  } catch (error) {
    console.error(`Error saving branchoffices: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

// 법인 id로 Detail 페이지랜딩 

const getCompanyById = async (company_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getCompaniseTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE company_id = ? AND office_id = ?`, [company_id, office_id]);
    if (rows.length > 0) {
      return {
        ...rows[0],
        reg_date: format(new Date(rows[0].reg_date), 'yyyy-MM-dd'),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error in getCompanyById: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

const getExecutivesById = async (company_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getExecutivesTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE company_id = ?`, [company_id]);
    return rows.map(row => ({
      ...row,
      reg_date: format(new Date(row.reg_date), 'yyyy-MM-dd'),
    }));
  } catch (error) {
    console.error(`Error in getExecutivesById: ${error.message}`);
    throw error; // 에러가 발생할 경우 예외를 던짐
  } finally {
    conn.release();
  }
};

const getShareholdersById = async (company_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getShareholdersTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE company_id = ?`, [company_id]);
    return rows;
  } finally {
    conn.release();
  }
};

const getBranchofficesById = async (company_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getBranchofficesTableName(office_id);
  try {
    const [rows] = await conn.query(`SELECT * FROM ${tableName} WHERE company_id = ?`, [company_id]);
    return rows.map(row => ({
      ...row,
      reg_date: format(new Date(row.reg_date), 'yyyy-MM-dd'),
    }));
  } catch (error) {
    console.error(`Error in getBranchofficesById: ${error.message}`);
    throw error; // 에러가 발생할 경우 예외를 던짐
  } finally {
    conn.release();
  }
};

// 회사 정보 업데이트
const updateCompany = async (company) => {
  const conn = await masterPool.getConnection();
  const tableName = getCompaniseTableName(company.office_id);
  const sql = `
    UPDATE ${tableName} SET
      requester = ?,
      co_category = ?,
      custom_co_category = ?,
      reg_number = ?,
      co_number = ?,
      category_rocation = ?,
      co_name = ?,
      eng_name = ?,
      reg_date = ?,
      co_address = ?,
      announcement = ?,
      stock_price = ?,
      stock_total_amount = ?,
      stock_amount = ?,
      capital = ?,
      purpose = ?,
      manager = ?,
      manager_mail = ?,
      manager_tel = ?,
      branchoffice_active = ?,
      co_settlement_month = ?,
      co_period = ?,
      co_custom_period = ?
    WHERE company_id = ? AND office_id = ?
  `;
  const values = [
    company.requester,
    company.co_category,
    company.custom_co_category,
    company.reg_number,
    company.co_number,
    company.category_rocation,
    company.co_name,
    company.eng_name,
    company.reg_date,
    company.co_address,
    company.announcement,
    company.stock_price,
    company.stock_total_amount,
    company.stock_amount,
    company.capital,
    company.purpose,
    company.manager,
    company.manager_mail,
    company.manager_tel,
    company.branchoffice_active,
    company.co_settlement_month,
    company.co_period,
    company.co_custom_period,
    company.company_id,
    company.office_id
  ];

  try {
    const result = await conn.query(sql, values);
    return result;
  } finally {
    conn.release();
  }
};

// 임원 정보 업데이트
const updateExecutives = async (executiveData) => {
  const conn = await masterPool.getConnection();
  const tableName = getExecutivesTableName(executiveData.office_id);
  const deleteSql = `DELETE FROM ${tableName} WHERE company_id = ?`;
  const insertSql = `
    INSERT INTO ${tableName} (
      company_id,
      role,
      name,
      number,
      reg_date,
      address, 
      representation
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await conn.query(deleteSql, [executiveData.company_id]);

    for (const executive of executiveData.executives) {
      const values = [
        executiveData.company_id,
        executive.role,
        executive.name,
        executive.number,
        executive.reg_date,
        executive.address,
        executive.representation ? 1 : 0
      ];
      await conn.query(insertSql, values);
    }
    return { message: 'Executives updated successfully' };
  } catch (error) {
    console.error(`Error updating executives: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

// 주주 정보 업데이트
const updateShareholders = async (shareholderData) => {
  const conn = await masterPool.getConnection();
  const tableName = getShareholdersTableName(shareholderData.office_id);
  const deleteSql = `DELETE FROM ${tableName} WHERE company_id = ?`;
  const insertSql = `
    INSERT INTO ${tableName} (
      company_id,
      name,
      number,
      stockamount,
      address
    ) VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await conn.query(deleteSql, [shareholderData.company_id]);

    for (const shareholder of shareholderData.shareholders) {
      const values = [
        shareholderData.company_id,
        shareholder.name,
        shareholder.number,
        shareholder.stockamount,
        shareholder.address
      ];
      await conn.query(insertSql, values);
    }
    return { message: 'Shareholders updated successfully' };
  } catch (error) {
    console.error(`Error updating shareholders: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};

// 지점 정보 업데이트
const updateBranchoffices = async (branchofficesData) => {
  const conn = await masterPool.getConnection();
  const tableName = getBranchofficesTableName(branchofficesData.office_id);
  const deleteSql = `DELETE FROM ${tableName} WHERE company_id = ?`;
  const insertSql = `
    INSERT INTO ${tableName} (
      company_id,
      name,
      reg_date,
      address
    ) VALUES (?, ?, ?, ?)
  `;

  try {
    await conn.query(deleteSql, [branchofficesData.company_id]);

    for (const branchoffice of branchofficesData.branchoffices) {
      const values = [
        branchofficesData.company_id,
        branchoffice.name,
        branchoffice.reg_date,
        branchoffice.address
      ];
      await conn.query(insertSql, values);
    }
    return { message: 'Branchoffices updated successfully' };
  } catch (error) {
    console.error(`Error updating branchoffices: ${error.message}`);
    throw error;
  } finally {
    conn.release();
  }
};


// 법인정보 삭제
const deleteCompany = async (company_id, office_id) => {
  const conn = await masterPool.getConnection();
  const tableName = getCompaniseTableName(office_id);
  try {
    const result = await conn.query(`DELETE FROM ${tableName} WHERE company_id = ?`, [company_id]);
    return result;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllcompanies,
  getAllexecutives,
  saveCompany,
  saveExecutives,
  saveShareholders,
  saveBranchoffices,
  getCompanyById,
  getExecutivesById,
  getShareholdersById,
  getBranchofficesById,
  updateCompany,
  updateExecutives,
  updateShareholders,
  updateBranchoffices,
  deleteCompany,
};
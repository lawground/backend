const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');
const { getUserByUsername, createUser, getUsersByRoleAndOffice } = require('../models/userModel');
const { getOfficeByName, getOfficeByCode, searchOffice, getOfficeByOfficeId} = require('../models/officeModel');

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {

    const user = await getUserByUsername(username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = generateToken({ username: user.username, office_id: user.office_id });
      return res.json({ token });
    } else {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  const { username, password, officeName, officeCode, role, name, phoneNumber, email, number } = req.body;
    try {
    const office = await getOfficeByName(officeName);
    if (!office) {
      return res.status(400).json({ message: 'Invalid office name' });
    }
    const officeVerificatrion = await getOfficeByCode(officeCode);
    if (!officeVerificatrion) {
      return res.status(400).json({ message: 'Invalid office code' });
    }
    

    const userExists = await getUserByUsername(username);
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    } 
    
    else {
        const newUser = { id: uuidv4(), username, password, office_id: office.office_id, role, name, phone: phoneNumber, email, number };
      await createUser(newUser);
      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await getUserByUsername(req.user.username);
    if (user) {
      const office = await getOfficeByOfficeId(user.office_id);
      if (office) {
        return res.json({
          ...user,
          office
        });
      } else {
        console.log('Office not found for user:', req.user.username);
        return res.status(404).json({ message: 'Office not found' });
      }
    } else {
      console.log('User not found:', req.user.username);
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during get user info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const searchOffices = async (req, res) => {
   const searchQuery = req.query.q;
    try{
    const offices = await searchOffice(searchQuery);

    res.json(offices);
  } catch (error) {

    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

const getUsersByRoleAndOfficeHandler = async (req, res) => {
  try {
    const { role, office_id } = req.query;

    if (!role || !office_id) {
      return res.status(400).json({ message: 'Role and office_id are required' });
    }

    const users = await getUsersByRoleAndOffice(role, office_id);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  register,
  getUserInfo,
  searchOffices,
  getUsersByRoleAndOfficeHandler,
};

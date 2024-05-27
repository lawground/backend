const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');
const { getUserByUsername, createUser } = require('../models/userModel');
const { getOfficeByName } = require('../models/officeModel');

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    console.log('Login attempt:', { username, password });

    const user = await getUserByUsername(username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('User found:', user);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (isPasswordValid) {
      const token = generateToken({ username: user.username, office_id: user.office_id });
      console.log('Token generated:', token);
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
  const { username, password, officeName, role, name, phoneNumber, email } = req.body;

  console.log('Registration attempt:', { username, officeName });

  try {
    const office = await getOfficeByName(officeName);
    if (!office) {
      console.log('Invalid office name:', officeName);
      return res.status(400).json({ message: 'Invalid office name' });
    }

    console.log('Office found:', office);

    const userExists = await getUserByUsername(username);
    if (userExists) {
      console.log('Username already exists:', username);
      return res.status(400).json({ message: 'Username already exists' });
    } else {
        const newUser = { id: uuidv4(), username, password, office_id: office.office_id, role, name, phone: phoneNumber, email };
      await createUser(newUser);
      console.log('User created:', newUser);
      return res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    console.log('Get user info for:', req.user.username);
    const user = await getUserByUsername(req.user.username);
    if (user) {
      console.log('User info retrieved:', user);
      return res.json(user);
    } else {
      console.log('User not found:', req.user.username);
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during get user info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  register,
  getUserInfo,
};

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const generateToken = (user) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = {
  generateToken,
};

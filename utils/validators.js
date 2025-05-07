// utils/validators.js

const validator = require('validator');

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
};

const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
};

module.exports = { validateEmail, validatePassword };

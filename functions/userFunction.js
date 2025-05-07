const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const { USER_JWT_SECRET } = require('../config/config');
const { validateEmail, validatePassword } = require('../utils/validators');

// REGISTER
const registerUser = async ({ username, email, password }) => {
  // Basic field checks
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  // Validations
  validateEmail(email);
  validatePassword(password);

  // Check for existing user
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  // Create new user (password is hashed by pre-save hook)
  const newUser = await User.create({ username, email, password });

  return {
    message: "Registration successful",
    user: {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      userNumber: newUser.userNumber
    }
  };
};


// LOGIN
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  // 🔴 Check if user is deactivated
  if (!user.isActive) {
    throw new Error("Your account has been deactivated. Please contact admin.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.userNumber }, USER_JWT_SECRET, { expiresIn: '7d' });

  return {
    message: "Login successful",
    token,
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      userNumber: user.userNumber
    }
  };
};


module.exports = {
  registerUser,
  loginUser,
};
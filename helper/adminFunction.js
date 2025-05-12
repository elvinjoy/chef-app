const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ADMIN_JWT_SECRET, JWT_EXPIRE } = require('../config/config'); // Use different secret for admin
const Admin = require('../model/adminModel'); // Assuming you have an Admin model
const { validateEmail, validatePassword } = require('../utils/validators');
const User = require('../model/userModel'); // Assuming you have a User model
// Admin registration

const adminRegister = async (username, email, password) => {
    // Validate email and password
    validateEmail(email);
    validatePassword(password);
  
    // Restrict to only one admin in the system
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      throw new Error('An admin account already exists');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create and save the new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });
  
    await newAdmin.save();
  
    // Generate JWT token
    const token = jwt.sign({ adminId: newAdmin._id }, ADMIN_JWT_SECRET, { expiresIn: JWT_EXPIRE });
  
    return { admin: newAdmin, token };
  };
  

// Admin login
const adminLogin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Admin not found');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ adminId: admin._id }, ADMIN_JWT_SECRET, { expiresIn: JWT_EXPIRE });

  return { admin, token };
};


const deactivateUser = async (userId) => {
  const user = await User.findOne({ userNumber: userId }); // using userNumber
  if (!user) throw new Error("User not found");

  if (!user.isActive) throw new Error("User is already deactivated");

  user.isActive = false;
  await user.save();

  return { message: "User has been deactivated" };
};

const reactivateUser = async (userId) => {
  const user = await User.findOne({ userNumber: userId });
  if (!user) throw new Error("User not found");

  if (user.isActive) throw new Error("User is already active");

  user.isActive = true;
  await user.save();

  return { message: "User has been reactivated" };
};

module.exports = { adminRegister, adminLogin, deactivateUser, reactivateUser };

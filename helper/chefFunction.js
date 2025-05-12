// functions/chefFunction.js

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Chef   = require('../model/chefModel'); 
const { CHEF_JWT_SECRET } = require('../config/config');
const { validateEmail, validatePassword } = require('../utils/validators');
const { create } = require('../model/recipeModel');

// REGISTER CHEF (unchanged)
const registerChef = async ({ username, email, password }) => {
  if (!username || !email || !password) throw new Error("All fields are required");
  validateEmail(email);
  validatePassword(password);
  const existing = await Chef.findOne({ email });
  if (existing) throw new Error("Email already exists");
  const newChef = await Chef.create({ username, email, password });
  return {
    message: "Chef registration successful",
    chef: {
      username: newChef.username,
      email: newChef.email,
      chefNumber: newChef.chefNumber
    }
  };
};

// LOGIN CHEF (updated)
// Login Chef function with modified payload
const loginChef = async ({ email, password }) => {
  const chef = await Chef.findOne({ email });
  if (!chef) throw new Error("Invalid credentials");

  if (!chef.isActive) {
    throw new Error("Your account has been deactivated. Please contact admin.");
  }

  const isMatch = await bcrypt.compare(password, chef.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // Build payload with chefId instead of id
  const payload = {
    chefId:     chef._id,
    username:   chef.username,
    email:      chef.email,
    role:       chef.role,
    chefNumber: chef.chefNumber,
    isActive:   chef.isActive,
    createdAt:  chef.createdAt
  };

  // Sign a token embedding the full payload
  const token = jwt.sign(payload, CHEF_JWT_SECRET, { expiresIn: '7d' });

  return {
    message: "Chef login successful",
    token,
    chef: {
      username:   chef.username,
      email:      chef.email,
      chefNumber: chef.chefNumber,
      createdAt:  chef.createdAt,
      role:       chef.role,
      isActive:   chef.isActive
    }
  };
};

module.exports = { registerChef, loginChef };

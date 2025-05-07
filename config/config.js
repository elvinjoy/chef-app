const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  USER_JWT_SECRET: process.env.USER_JWT_SECRET,
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
  CHEF_JWT_SECRET: process.env.CHEF_JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
};

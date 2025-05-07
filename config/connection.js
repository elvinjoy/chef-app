const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/chef-app',
  PORT: process.env.PORT || 3000,
};

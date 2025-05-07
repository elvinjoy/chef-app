const express = require('express');
const router = express.Router();

const {
  registerChefController,
  loginChefController
} = require('../controller/chefController');

// Chef routes
router.post('/register', registerChefController);
router.post('/login', loginChefController);

module.exports = router;

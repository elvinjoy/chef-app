const {
    adminRegisterController,
    adminLoginController,
    deactivateUserController,
    reactivateUserController
  } = require('../controller/adminController');
  const { adminProtect, adminOnly } = require('../middleware/adminMiddleware');
  
  const router = require('express').Router();
  
  // Admin auth
  router.post('/register', adminRegisterController);
  router.post('/login', adminLoginController);
  
  // Admin user controls
  router.patch('/deactivate-user/:userNumber',adminProtect, adminOnly, deactivateUserController);
  router.patch('/reactivate-user/:userNumber',adminProtect, adminOnly, reactivateUserController);
  
  module.exports = router;
  
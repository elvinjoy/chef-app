const {
    registerChef,
    loginChef,
  } = require('../helper/chefFunction');
  
  // CHEF REGISTER CONTROLLER
  const registerChefController = async (req, res) => {
    try {
      const result = await registerChef(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
  };
  
  // CHEF LOGIN CONTROLLER
  const loginChefController = async (req, res) => {
    try {
      const result = await loginChef(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: "Login failed!", error: error.message });
    }
  };
  
  module.exports = {
    registerChefController,
    loginChefController,
  };
  
const {
  registerUser,
  loginUser,
} = require('../helper/userFunction');

// REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: "Login failed!", error: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
};

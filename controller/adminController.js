const { adminRegister, adminLogin, deactivateUser, reactivateUser } = require('../functions/adminFunction');

const adminRegisterController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const { admin, token } = await adminRegister(username, email, password);
    res.status(201).json({ admin, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const adminLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { admin, token } = await adminLogin(email, password);
    res.status(200).json({ admin, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deactivateUserController = async (req, res) => {
  try {
    const result = await deactivateUser(req.params.userNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const reactivateUserController = async (req, res) => {
  try {
    const result = await reactivateUser(req.params.userNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



module.exports = { adminRegisterController, adminLoginController, deactivateUserController, reactivateUserController };

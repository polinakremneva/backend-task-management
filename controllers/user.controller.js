const User = require("../models/user.model");

async function getLoggedInUser(req, res) {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove password from the user object before sending the response
    const { password, ...userWithoutPassword } = user.toObject();

    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// EXPORT CONTROLLER
module.exports = {
  getLoggedInUser,
};

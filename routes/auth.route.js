const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const User = require("../models/user.model");

router.post("/register", register);
router.post("/login", login);

router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.json({ available: false }); // Username is not available
    } else {
      res.json({ available: true }); // Username is available
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.json({ available: false }); // Email is not available
    } else {
      res.json({ available: true }); // Email is available
    }
  } catch (error) {
    console.error("Error checking email availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// auth.route.js

module.exports = router;

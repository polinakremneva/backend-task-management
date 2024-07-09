const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkEmail,
  checkUsername,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/check-email", checkEmail);
router.post("/check-username", checkUsername);

// auth.route.js

module.exports = router;

const express = require("express");
const router = express.Router();

const { getLoggedInUser } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// configuring the router
router.get("/loggedInUser", verifyToken, getLoggedInUser);

// export router
module.exports = router;

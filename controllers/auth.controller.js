const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

async function register(req, res) {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email }); // Use findOne to check if the user exists
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash password
    console.log(username, password);
    const user = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName, // Include any other data you want to store in the user document
    }); // Create new user object
    await user.save(); // Save user to database

    // Send token in response to the client
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}
async function checkEmail(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ available: false });
  }
  res.json({ available: true });
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate JWT token containing user id
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token in response to the client, not the user object!
    res.status(200).json({ token });
    console.log(token);
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}

async function checkUsername(req, res) {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ available: false });
  }
  res.json({ available: true });
}

module.exports = { register, login, checkEmail, checkUsername };

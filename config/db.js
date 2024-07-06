// config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load env vars

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // To avoid deprecation warning
      // useUnifiedTopology: true, // To avoid deprecation warning
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
}

// Export the function
module.exports = connectDB;

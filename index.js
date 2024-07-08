const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const { verifyToken } = require("./middleware/auth.middleware");

dotenv.config(); // Load config

async function main() {
  // Connect to database
  await connectDB();

  // MIDDLEWARES
  app.use(express.static("public"));

  // parse json body in request (for POST, PUT, PATCH requests)
  app.use(express.json());

  // allow CORS fir local development (for production, you should configure it properly)
  app.use(cors());

  // ROUTES
  const taskRoutes = require("./routes/task.route");
  const userRoutes = require("./routes/user.route");
  const authRoutes = require("./routes/auth.route");

  app.use("/api/task", verifyToken, taskRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();

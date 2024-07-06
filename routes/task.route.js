// routes/products.js
const express = require("express");
const router = express.Router();
const {
  getUserTasks,
  getTaskById,
  createTask,
  deleteTask,
} = require("../controllers/task.controller");


router.get("/", getUserTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.delete("/:id", deleteTask);

module.exports = router;

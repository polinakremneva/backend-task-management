const User = require("../models/user.model");
const Task = require("../models/task.model");
// const { buildCriteria } = require("../helpers/product.helper");

// Get all products
async function getUserTasks(req, res) {
  try {
    const userId = req.userId; // Получаем ID пользователя из middleware

    const tasks = await Task.find({ user: userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(
      "task.controller, getUserTasks. Error while getting tasks",
      error
    );
    res.status(500).json({ message: "Server error while getting tasks" });
  }
}

// Get a single product
async function getTaskById(req, res) {
  const userId = req.userId; // Assuming userId is obtained from authentication middleware
  const { id } = req.params;

  try {
    // Find task by ID and user ID
    const task = await Task.findOne({ _id: id, user: userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    if (err.name === "CastError") {
      console.log(
        `task.controller, getTaskById. CastError! Task not found with id: ${id}`
      );
      return res.status(404).json({ message: "Task not found" });
    }
    console.error(
      `task.controller, getTaskById. Error while getting task with id: ${id}`,
      err
    );
    res.status(500).json({ message: "Server error while getting task" });
  }
}

// Delete an product
async function deleteTask(req, res) {
  const userId = req.userId; // Assuming userId is obtained from authentication middleware
  const { id } = req.params;

  try {
    // Find the task by ID and user ID
    const task = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!task) {
      console.log(`task.controller, deleteTask. Task not found with id: ${id}`);
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log(
      `task.controller, deleteTask. Error while deleting task with id: ${id}`,
      err
    );
    res.status(500).json({ message: "Server error while deleting task" });
  }
}

// Create a new product
async function createTask(req, res) {
  const taskToAdd = req.body;
  taskToAdd.user = req.userId;
  const newTask = new Task(taskToAdd);

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.name === "ValidationError") {
      // Mongoose validation error
      console.log(`task.controller, createTask. ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      // Other types of errors
      console.log(`task.controller, createTask. ${err.message}`);
      res.status(500).json({ message: "Server error while creating task" });
    }
  }
}

async function updateTask(req, res) {
  const userId = req.userId; // Assuming userId is obtained from authentication middleware
  const { id } = req.params;
  const taskToUpdate = req.body;

  try {
    // Find the task by ID and user ID
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: taskToUpdate },
      { new: true }
    );

    if (!updatedTask) {
      console.log(`task.controller, updateTask. Task not found with id: ${id}`);
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.log(
      `task.controller, updateTask. Error while updating task with id: ${id}`,
      err
    );
    res.status(500).json({ message: "Server error while updating task" });
  }
}

module.exports = {
  getUserTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
};

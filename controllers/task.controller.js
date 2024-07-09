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
  const { id } = req.params;

  try {
    // Найти задачу по ID и удалить её
    const task = await Task.findOneAndDelete({ _id: id });

    if (!task) {
      console.log(`Задача с ID ${id} не найдена`);
      return res.status(404).json({ message: "Задача не найдена" });
    }

    console.log(`Задача удалена: ${task}`);

    // Обновить массив задач пользователя, чтобы удалить удаленную задачу
    const updatedUser = await User.findByIdAndUpdate(
      task.user, // ID пользователя, связанного с задачей
      { $pull: { tasks: task._id } }, // Удалить ID задачи из массива tasks
      { new: true } // Вернуть обновленный документ пользователя
    );

    if (!updatedUser) {
      console.log(`Пользователь с ID ${task.user} не найден`);
      // Можно обработать этот случай по-другому в зависимости от логики вашего приложения
    }

    console.log(`Задачи пользователя обновлены: ${updatedUser}`);

    return res.status(204).json({ message: "Задача удалена" });
  } catch (err) {
    console.error(`Ошибка при удалении задачи с ID ${id}`, err);
    return res
      .status(500)
      .json({ message: "Ошибка сервера при удалении задачи" });
  }
}

module.exports = {
  deleteTask,
};

// Create a new product
async function createTask(req, res) {
  const taskToAdd = req.body;
  taskToAdd.user = req.userId;

  // Преобразуем todoList из строки в массив объектов
  taskToAdd.todoList = taskToAdd.todoList.split(",").map((item) => ({
    title: item.trim(),
    isComplete: false,
  }));

  const newTask = new Task(taskToAdd);

  try {
    const savedTask = await newTask.save();

    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    if (!user) {
      console.log(`User not found with ID: ${req.userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json(savedTask, "success");
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log(`Validation error: ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      console.log(`Server error while creating task: ${err.message}`);
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

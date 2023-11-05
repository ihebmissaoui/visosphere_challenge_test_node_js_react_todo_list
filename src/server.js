const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware
const app = express();

// Create a simple in-memory database of tasks
const tasks = [];

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Define routes

// Create a new task
app.post("/api/tasks", (req, res) => {
  const newTask = req.body;
  newTask.id = tasks.length + 1; // Assign a unique ID
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all tasks with optional filtering
app.get("/api/tasks", (req, res) => {
  const statusFilter = req.query.status;
  const sortedTasks = tasks.slice().sort((a, b) => b.id - a.id); // Sort by ID (most recent first)

  if (statusFilter) {
    const filteredTasks = sortedTasks.filter((task) => task.status === statusFilter);
    res.json(filteredTasks);
  } else {
    res.json(sortedTasks);
  }
});

// Get a single task by ID
app.get("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    const deletedTask = tasks.splice(taskIndex, 1);
    res.json(deletedTask[0]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

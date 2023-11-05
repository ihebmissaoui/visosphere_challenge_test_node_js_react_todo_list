import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // Default filter: all tasks

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("http://localhost:3000/api/tasks") // Use port 3000
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error(error));
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    fetch("http://localhost:3000/api/tasks", { // Use port 3000
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask, status: "pending" }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewTask("");
        fetchTasks(); // Refresh the task list
      })
      .catch((error) => console.error(error));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    fetch(`http://localhost:3000/api/tasks/${taskId}`, { // Use port 3000
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(() => {
        fetchTasks(); // Refresh the task list
      })
      .catch((error) => console.error(error));
  };

  const filterTasks = (status) => {
    setFilter(status);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div>
      <h1>My To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add</button>

      <div>
        Filter:
        <button onClick={() => filterTasks("all")}>All</button>
        <button onClick={() => filterTasks("pending")}>Pending</button>
        <button onClick={() => filterTasks("in progress")}>In Progress</button>
        <button onClick={() => filterTasks("complete")}>Complete</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.status === "complete" ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            <button
              onClick={() =>
                updateTaskStatus(task.id, task.status === "complete" ? "pending" : "complete")
              }
            >
              {task.status === "complete" ? "Reopen" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

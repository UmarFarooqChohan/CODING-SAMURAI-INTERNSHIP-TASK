import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDeadline, setNewDeadline] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        text: newTask.trim(),
        completed: false,
        priority: newPriority,
        deadline: newDeadline || null,
      },
    ]);
    setNewTask("");
    setNewPriority("Medium");
    setNewDeadline("");
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveEdit = (index) => {
    if (!editingText.trim()) return;
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editingText.trim();
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  // Drag-and-drop handlers
  const onDragStart = (e, index) => e.dataTransfer.setData("index", index);
  const onDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("index");
    if (dragIndex === null) return;

    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(dropIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };
  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="App">
      <header>
        <h1>Farooq's Advanced React To-Do List</h1>
      </header>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            data-priority={task.priority}
            className={task.completed ? "completed" : ""}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragOver={onDragOver}
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(index);
                  if (e.key === "Escape") setEditingIndex(null);
                }}
                onBlur={() => saveEdit(index)}
                autoFocus
              />
            ) : (
              <span onClick={() => toggleComplete(index)}>
                {task.text}
                {task.deadline && ` - Due: ${task.deadline}`}
              </span>
            )}
            <div>
              <button onClick={() => startEditing(index)}>Edit</button>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <footer>
        <p>Developed by Umar Farooq</p>
      </footer>
    </div>
  );
}

export default App;

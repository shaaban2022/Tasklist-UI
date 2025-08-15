import { useState } from "react";
import "./AssignTaskPopup.css";

const AssignTaskPopup = ({ onClose, onAssign, assignedToEmail }) => {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task || !dueDate || !priority) {
      alert("Please fill in all fields");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    const newTask = {
      task,
      dueDate,
      priority,
      assignedToEmail, 
      assigneeName: currentUser.fullName || currentUser.name || "",
      assigneeEmail: currentUser.email || ""
    };

    if (!newTask.assigneeName || !newTask.assigneeEmail) {
      alert("Please log in first");
      return;
    }

    onAssign(newTask); 
    onClose(); 
  };

  return (
    <div className="assign-task-popup-overlay" onClick={onClose}>
      <div
        className="assign-task-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Assign Task</h2>
        <form onSubmit={handleSubmit}>
          <label>Task:</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
          />

          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="assign-task-popup-buttons">
            <button type="submit" className="btn-assign">Assign</button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskPopup;

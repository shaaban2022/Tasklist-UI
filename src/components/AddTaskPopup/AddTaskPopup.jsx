import { useState } from "react";
import "./AddTaskPopup.css";

const AddTaskPopup = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date) {
      alert("Please fill in at least the title and date.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      alert("You must be logged in to add a task.");
      return;
    }

    const newTask = {
      task: title,
      due_date: date,
      priority: priority,
      assignee_name: currentUser.fullName,
      assignee_email: currentUser.email
    };

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setTitle("");
        setDate("");
        setPriority("Medium");
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Server error while adding task");
    }
  };


  return (
    <div className="popup-backdrop">
      <div className="popup-modal">
        <h2 className="popup-heading">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="popup-input"
            required
          />

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="popup-input"
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="popup-input"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="popup-actions">
            <button type="button" onClick={onClose} className="popup-cancel">
              Cancel
            </button>
            <button type="submit" className="popup-submit">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPopup;

import React, { useState, useEffect } from 'react';
import SideNavbar from '../../components/SideNavbar/SideNavbar';
import AddTaskPopup from '../../components/AddTaskPopup/AddTaskPopup';
import './AddTaskPage.css';

const AddTaskPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Define the base URL for your backend API using the environment variable
  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUserTasks = async () => {
    if (!currentUser) return;
    try {
      // *** IMPORTANT CHANGE HERE (1 of 2) ***
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/user-tasks?assignee_email=${currentUser.email}`);
      const data = await res.json();
      if (res.ok) {
        const formattedTasks = data.map((t) => ({
          id: t.sr_no,
          title: t.task,
          priority: t.priority,
          start: t.assigned_date,
          end: t.due_date,
          status: t.status,
          assignee: 'https://via.placeholder.com/32', // This is a placeholder, not a backend call
        }));
        setTasks(formattedTasks);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const onAddNewTask = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleAddTask = async (task) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return;

    const newTask = {
      task: task.title,
      due_date: task.date,
      priority: task.priority,
      assignee_name: currentUser.fullName,
      assignee_email: currentUser.email
    };

    try {
      // *** IMPORTANT CHANGE HERE (2 of 2) ***
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        closePopup();
        fetchUserTasks(); // Refresh the tasks list
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Server error while adding task");
    }
  };

  // Group tasks by assigned date
  const tasksByDate = tasks.reduce((acc, task) => {
    const dateKey = new Date(task.start).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="account-layout">
      <SideNavbar />

      <div className="account-page">
        <div className="account-header">
          <h2>Add New Task</h2>
        </div>

        <div className="account-details">
          <div className="add-task-wrapper">
            <button className="add-task-btn" onClick={onAddNewTask}>
              + Add Task
            </button>
          </div>

          {sortedDates.map((date) => (
            <div key={date} className="tasks-section">
              <h3 className="tasks-section-date">Assigned on {date}</h3>
              <div className="tasks-section-list">
                {tasksByDate[date].map((t) => (
                  <div key={t.id} className="task-card">
                    <div className="task-title">{t.title}</div>
                    <div className="task-details">
                      <span className={`task-priority ${t.priority.toLowerCase()}`}>
                        {t.priority} Priority
                      </span>
                      <span className="task-due">
                        Due: {new Date(t.end).toLocaleString()}
                      </span>
                      <span className="task-status">
                        Status: {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AddTaskPopup
          isOpen={isPopupOpen}
          onClose={closePopup}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
};

export default AddTaskPage;

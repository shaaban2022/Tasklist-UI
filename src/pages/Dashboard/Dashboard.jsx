import { useState, useEffect } from "react";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import AddTaskButton from "../../components/AddTaskButton/AddTaskButton";
import AddTaskPopup from "../../components/AddTaskPopup/AddTaskPopup";
import TasksTable from "../../components/TasksTable/TasksTable";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  // Define the base URL for your backend API using the environment variable
  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Function to fetch tasks from the backend
  const fetchTasksFromBackend = async () => {
    if (!userEmail) {
      // If no user email, return an empty array or handle as needed
      // (This likely means the user is not logged in, and should be redirected or shown no data)
      setTasks([]);
      return;
    }

    try {
      const resUserTasks = await fetch(
        `${BACKEND_API_BASE_URL}/api/user-tasks?assignee_email=${encodeURIComponent(userEmail)}`
      );
      const userTasks = await resUserTasks.json();

      const resAssignedTasks = await fetch(
        `${BACKEND_API_BASE_URL}/api/assigned-tasks?assigned_to_email=${encodeURIComponent(userEmail)}`
      );
      const assignedTasks = await resAssignedTasks.json();

      const normalizeTasks = (tasksArray, sourceName) =>
        tasksArray.map(task => ({
          id: task.sr_no,
          title: task.task,
          start: new Date(task.assigned_date || task.due_date),
          end: new Date(task.due_date),
          status: task.status || "Not Started",
          priority: task.priority,
          assignee: task.assignee_name || "",
          source: sourceName
        }));

      const combinedTasks = [
        ...normalizeTasks(userTasks, "tasks"),
        ...normalizeTasks(assignedTasks, "assigned_tasks")
      ];

      setTasks(combinedTasks);
    } catch (error) {
      console.error("Error fetching tasks from backend:", error);
      // In a deployed app, you might want to show a user-friendly error message
      // or set tasks to an empty array rather than using db.initialTasks mock data.
      setTasks([]); // Fallback to empty if API fails
    }
  };

  useEffect(() => {
    fetchTasksFromBackend();
  }, [userEmail]); // Re-fetch if userEmail changes

  const handleStatusChange = async (id, newStatus, source = "tasks") => {
    try {
      let url = "";
      if (source === "tasks") {
        url = `${BACKEND_API_BASE_URL}/api/tasks/${id}/status`;
      } else if (source === "assigned_tasks") {
        url = `${BACKEND_API_BASE_URL}/api/assigned-tasks/${id}/status`;
      } else {
        console.warn("Unknown task source:", source);
        return;
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update task status");
      }

      // Optimistically update UI
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert UI change or show error message
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status?.toLowerCase() === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status?.toLowerCase() === "in progress").length;
  const notStartedTasks = totalTasks - completedTasks - inProgressTasks;

  const summaryCards = [
    { title: "Total Tasks", value: totalTasks },
    { title: "Completed Tasks", value: completedTasks },
    { title: "Not Started Tasks", value: notStartedTasks },
    { title: "In-Progress Tasks", value: inProgressTasks },
  ];

  const handleAddTask = async (newTask) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return;

    const taskToSend = {
      task: newTask.title,
      due_date: newTask.date,
      priority: newTask.priority,
      assignee_name: currentUser.fullName,
      assignee_email: currentUser.email
    };

    try {
      // This fetch is handled by AddTaskPopup, but if Dashboard also needed to add,
      // it would use BACKEND_API_BASE_URL here too.
      // (The AddTaskPopup component itself has already been updated for this.)
      // For now, this handleAddTask just formats and adds to local state which is then refreshed by fetchUserTasks
      await fetchTasksFromBackend(); // Re-fetch tasks after AddTaskPopup potentially adds one
      setIsPopupOpen(false); // Close popup after successful add
    } catch (err) {
      console.error("Error adding task:", err);
      // Error handling already in AddTaskPopup, but can add more here if direct fetch
    }
  };

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="main-content">
        <div className="dashboard-header">
          <div className="dashboard-title">Dashboard</div>
          <AddTaskButton onClick={() => setIsPopupOpen(true)} />
        </div>

        <div className="cards-grid">
          {summaryCards.map((card, index) => (
            <div className="card" key={index}>
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="table-section">
          <h1>Task Details</h1>
          {/* Note: The TasksTable component itself also needs the VITE_BACKEND_URL update if not done yet.
              You are passing 'tasks' prop here, but TasksTable also fetches its own.
              Consider if TasksTable should receive tasks as a prop OR fetch itself.
              If it fetches itself, you might not need to pass 'tasks' here.
          */}
          <TasksTable tasks={tasks} showAssignee={false} onStatusChange={handleStatusChange} />
        </div>
      </div>

      <AddTaskPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddTask={handleAddTask} // This prop receives data from popup, but actual API call is inside popup's handleSubmit
      />
    </div>
  );
};

export default Dashboard;

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

  useEffect(() => {
    if (!userEmail) {
      const initialTasks = db.initialTasks.map(task => ({
        id: task.id,
        title: task.title,
        start: new Date(task.start),
        end: new Date(task.end),
        status: task.status || "Not Started",
        priority: task.priority,
        assignee: task.assignee || "",
        source: "tasks"
      }));
      setTasks(initialTasks);
      return;
    }

    const fetchTasks = async () => {
      try {
        const resUserTasks = await fetch(
          `http://localhost:5000/api/user-tasks?assignee_email=${encodeURIComponent(userEmail)}`
        );
        const userTasks = await resUserTasks.json();

        const resAssignedTasks = await fetch(
          `http://localhost:5000/api/assigned-tasks?assigned_to_email=${encodeURIComponent(userEmail)}`
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
        console.error("Error fetching tasks:", error);
        const initialTasks = db.initialTasks.map(task => ({
          id: task.id,
          title: task.title,
          start: new Date(task.start),
          end: new Date(task.end),
          status: task.status || "Not Started",
          priority: task.priority,
          assignee: task.assignee || "",
          source: "tasks"
        }));
        setTasks(initialTasks);
      }
    };

    fetchTasks();
  }, [userEmail]);

  const handleStatusChange = async (id, newStatus, source = "tasks") => {
    try {
      let url = "";
      if (source === "tasks") {
        url = `http://localhost:5000/api/tasks/${id}/status`;
      } else if (source === "assigned_tasks") {
        url = `http://localhost:5000/api/assigned-tasks/${id}/status`;
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

      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
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

  const handleAddTask = (newTask) => {
    const formattedTask = {
      id: tasks.length + 1,
      title: newTask.title,
      start: new Date(newTask.date),
      end: new Date(newTask.date),
      status: "Not Started",
      priority: newTask.priority,
      assignee: "",
      source: "tasks"
    };
    setTasks(prev => [...prev, formattedTask]);
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
          <TasksTable tasks={tasks} showAssignee={false} onStatusChange={handleStatusChange} />
        </div>
      </div>

      <AddTaskPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default Dashboard;

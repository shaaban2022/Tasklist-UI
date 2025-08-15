import './Tasks.css';
import SideNavbar from '../../components/SideNavbar/SideNavbar';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import AddTaskPopup from '../../components/AddTaskPopup/AddTaskPopup';
import TasksTable from '../../components/TasksTable/TasksTable';
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views, Navigate } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, onDayStep }) => {
  return (
    <div className="calendar-toolbar">
      <div className="nav-buttons">
        <button onClick={() => onNavigate(Navigate.TODAY)}>Today</button>
        <button onClick={() => onNavigate(Navigate.PREVIOUS)}>Back</button>
        <button onClick={() => onNavigate(Navigate.NEXT)}>Next</button>
        <button onClick={() => onDayStep(-1)}>Prev Day</button>
        <button onClick={() => onDayStep(1)}>Next Day</button>
      </div>
      <span className="calendar-label">{label}</span>
      <div className="view-buttons">
        <button onClick={() => onView(Views.MONTH)}>Month</button>
        <button onClick={() => onView(Views.WEEK)}>Week</button>
        <button onClick={() => onView(Views.DAY)}>Day</button>
      </div>
    </div>
  );
};

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState(Views.MONTH);
  const [tasks, setTasks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");

      const assignedRes = await fetch(
        `http://localhost:5000/api/assigned-tasks?assigned_to_email=${userEmail}`
      );
      let assignedData = await assignedRes.json();
      assignedData = assignedData.map((task) => ({
        id: task.sr_no,
        title: task.task,
        start: new Date(task.assigned_date),
        end: new Date(task.due_date),
        status: task.status,
        priority: task.priority,
        assigneeName: task.assignee_name,
        source: "assigned_tasks",
      }));

      const userRes = await fetch(
        `http://localhost:5000/api/user-tasks?assignee_email=${userEmail}`
      );
      let userData = await userRes.json();
      userData = userData.map((task) => ({
        id: task.sr_no,
        title: task.task,
        start: new Date(task.assigned_date || task.due_date), 
        end: new Date(task.due_date),
        status: task.status,
        priority: task.priority,
        assigneeName: "Me",
        source: "tasks",
      }));

      const combinedTasks = [...assignedData, ...userData];

      setTasks(combinedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  if (userEmail) {
    fetchTasks();
  }
}, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/assigned-tasks/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleNavigate = (action) => {
    let newDate = new Date(calendarDate);

    if (action === Navigate.TODAY) {
      newDate = new Date();
    } else if (action === Navigate.NEXT) {
      if (calendarView === Views.MONTH) newDate.setMonth(newDate.getMonth() + 1);
      else if (calendarView === Views.WEEK) newDate.setDate(newDate.getDate() + 7);
      else if (calendarView === Views.DAY) newDate.setDate(newDate.getDate() + 1);
    } else if (action === Navigate.PREVIOUS) {
      if (calendarView === Views.MONTH) newDate.setMonth(newDate.getMonth() - 1);
      else if (calendarView === Views.WEEK) newDate.setDate(newDate.getDate() - 7);
      else if (calendarView === Views.DAY) newDate.setDate(newDate.getDate() - 1);
    }

    setCalendarDate(newDate);
  };

  const handleDayStep = (step) => {
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() + step);
    setCalendarDate(newDate);
    setCalendarView(Views.DAY);
  };

  const handleAddTask = (newTask) => {
    const formattedTask = {
      id: tasks.length + 1,
      title: newTask.title,
      start: new Date(newTask.date),
      end: new Date(newTask.date),
      status: "Not Started",
      priority: newTask.priority,
      assigneeName: "You" 
    };
    setTasks((prev) => [...prev, formattedTask]);
  };

  return (
    <div className="tasks-page">
      <SideNavbar />
      <div className="tasks-content">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <AddTaskButton onClick={() => setIsPopupOpen(true)} />
        </div>

        <div className="tabs">
          <span
            className={`tab ${activeTab === "list" ? "active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            List
          </span>
          <span
            className={`tab ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </span>
        </div>

        {activeTab === "list" && (
          <div className="my-tasks">
            <h3>My Tasks</h3>
            <TasksTable
              tasks={tasks}
              onStatusChange={handleStatusChange}
              showAssignee={true}
            />
          </div>
        )}

        {activeTab === "calendar" && (
          <div style={{ height: "600px" }}>
            <BigCalendar
              localizer={localizer}
              events={tasks}
              startAccessor="start"
              endAccessor="end"
              date={calendarDate}
              view={calendarView}
              onNavigate={setCalendarDate}
              onView={setCalendarView}
              style={{ height: "100%" }}
              views={["month", "week", "day"]}
              defaultView="month"
              components={{
                toolbar: (props) => (
                  <CustomToolbar
                    {...props}
                    onNavigate={handleNavigate}
                    onDayStep={handleDayStep}
                    onView={(view) => setCalendarView(view)}
                  />
                ),
              }}
              eventPropGetter={() => ({
                style: { backgroundColor: "#1976d2", color: "white", borderRadius: "5px" }
              })}
            />
          </div>
        )}

        <AddTaskPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
};

export default Tasks;

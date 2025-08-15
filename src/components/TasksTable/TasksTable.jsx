import { useState, useEffect } from "react";
import moment from "moment";
import "./TasksTable.css";

import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import "jspdf-autotable"; // attaches autoTable to jsPDF prototype


const TasksTable = ({ showAssignee = true }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateSort, setDueDateSort] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");

        const assignedRes = await fetch(
          `http://localhost:5000/api/assigned-tasks?assigned_to_email=${userEmail}`
        );
        let assignedData = await assignedRes.json();
        assignedData = assignedData.map((t) => ({
          ...t,
          source: "assigned_tasks",
        }));

        const ownRes = await fetch(
          `http://localhost:5000/api/user-tasks?assignee_email=${userEmail}`
        );
        let ownData = await ownRes.json();
        ownData = ownData.map((t) => ({
          ...t,
          source: "tasks",
        }));

        const combinedTasks = [...assignedData, ...ownData].sort(
          (a, b) => new Date(a.due_date) - new Date(b.due_date)
        );

        setTasks(combinedTasks);
        setFilteredTasks(combinedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  // Handle filters
  useEffect(() => {
    let tempTasks = [...tasks];

    if (statusFilter) {
      tempTasks = tempTasks.filter(
        (t) => t.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (priorityFilter) {
      tempTasks = tempTasks.filter(
        (t) => t.priority?.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    if (dueDateSort === "newest") {
      tempTasks.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
    } else if (dueDateSort === "oldest") {
      tempTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    }

    setFilteredTasks(tempTasks);
  }, [statusFilter, dueDateSort, priorityFilter, tasks]);

  const handleStatusChange = async (taskId, newStatus, source) => {
    try {
      const endpoint =
        source === "tasks"
          ? `http://localhost:5000/api/tasks/${taskId}/status`
          : `http://localhost:5000/api/assigned-tasks/${taskId}/status`;

      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.sr_no === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleDeleteTask = async (taskId, source) => {
    try {
      const endpoint =
        source === "tasks"
          ? `http://localhost:5000/api/tasks/${taskId}`
          : `http://localhost:5000/api/assigned-tasks/${taskId}`;

      await fetch(endpoint, {
        method: "DELETE",
      });

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.sr_no !== taskId)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };


  const downloadPDF = () => {
    if (!filteredTasks || filteredTasks.length === 0) return;

    const doc = new jsPDF();

    const columns = ["Sr.No.", "Task", "Assigned Date", "Due Date", "Status", "Priority", "Assignee"];

    const rows = filteredTasks.map((task, index) => [
      index + 1,
      task.task,
      moment(task.assigned_date).format("YYYY-MM-DD"),
      moment(task.due_date).format("YYYY-MM-DD"),
      task.status,
      task.priority,
      task.assignee_name || "N/A"
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
      styles: { fontSize: 10 },
    });

    doc.save("Tasks.pdf");
  };

  const sendTasksToEmail = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("No user email found. Please log in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/send-tasks-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail })
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error sending tasks:", error);
      alert("Failed to send tasks to your email.");
    }
  };



  // Download Word
  const downloadWord = async () => {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Sr.No.")] }),
          new TableCell({ children: [new Paragraph("Task")] }),
          new TableCell({ children: [new Paragraph("Assigned Date")] }),
          new TableCell({ children: [new Paragraph("Due Date")] }),
          new TableCell({ children: [new Paragraph("Status")] }),
          new TableCell({ children: [new Paragraph("Priority")] }),
          ...(showAssignee ? [new TableCell({ children: [new Paragraph("Assignee")] })] : [])
        ]
      }),
      ...filteredTasks.map((task, index) => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(String(index + 1))] }),
          new TableCell({ children: [new Paragraph(task.task)] }),
          new TableCell({ children: [new Paragraph(moment(task.assigned_date).format("YYYY-MM-DD"))] }),
          new TableCell({ children: [new Paragraph(moment(task.due_date).format("YYYY-MM-DD"))] }),
          new TableCell({ children: [new Paragraph(task.status)] }),
          new TableCell({ children: [new Paragraph(task.priority)] }),
          ...(showAssignee ? [new TableCell({ children: [new Paragraph(task.assignee_name || "N/A")] })] : [])
        ]
      }))
    ];

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "All Tasks", heading: "Heading1" }),
            new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Tasks.docx");
  };

  return (
    <div className="tasks-table">
      {/* Download Dropdown */}
      {/* Download Dropdown */}
      <div className="download-dropdown">
        <label htmlFor="download-select">Download All Tasks:</label>
        <select
          id="download-select"
          onChange={(e) => {
            if (e.target.value === "pdf") downloadPDF();
            if (e.target.value === "word") downloadWord();
            e.target.value = ""; // Reset dropdown after download
          }}
        >
          <option value="">Select format</option>
          <option value="pdf">PDF</option>
          <option value="word">Word</option>
        </select>

        {/* 📧 Email button */}
        <button className="email-btn" onClick={sendTasksToEmail}>
          📧 Send to Email
        </button>
      </div>


      {/* Filter buttons */}
      <div className="filters">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select onChange={(e) => setDueDateSort(e.target.value)} value={dueDateSort}>
          <option value="">Due Date (Default)</option>
          <option value="oldest">Due soon</option>
          <option value="newest">Due later</option>
        </select>

        <select onChange={(e) => setPriorityFilter(e.target.value)} value={priorityFilter}>
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Task</th>
            <th>Assigned Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Priority</th>
            {showAssignee && <th>Assignee</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={`${task.source}-${task.sr_no || index}`}>
              <td>{index + 1}</td>
              <td className="task-link">{task.task}</td>
              <td>{moment(task.assigned_date).format("YYYY-MM-DD")}</td>
              <td>{moment(task.due_date).format("YYYY-MM-DD")}</td>
              <td>
                <div className="dropdown-wrapper">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.sr_no, e.target.value, task.source)
                    }
                    className={`status-dropdown ${task.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </td>
              <td>
                <span className={`badge ${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </span>
              </td>
              {showAssignee && <td>{task.assignee_name || "N/A"}</td>}
              <td>
                {task.status === "Completed" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.sr_no, task.source)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;

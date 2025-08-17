import { useState, useEffect } from "react";
import moment from "moment";
import "./TasksTable.css";

import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import "jspdf-autotable";

import ShowEntries from '../ShowEntries/ShowEntries';
import Pagination from '../Pagination/Pagination';


const TasksTable = ({ showAssignee = true }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateSort, setDueDateSort] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");

        const assignedRes = await fetch(
          `${BACKEND_API_BASE_URL}/api/assigned-tasks?assigned_to_email=${userEmail}`
        );
        let assignedData = await assignedRes.json();
        assignedData = assignedData.map((t) => ({
          ...t,
          source: "assigned_tasks",
        }));

        const ownRes = await fetch(
          `${BACKEND_API_BASE_URL}/api/user-tasks?assignee_email=${userEmail}`
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
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

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
    setCurrentPage(1); 
  }, [statusFilter, dueDateSort, priorityFilter, tasks]);

  const handleStatusChange = async (taskId, newStatus, source) => {
    try {
      const endpoint =
        source === "tasks"
          ? `${BACKEND_API_BASE_URL}/api/tasks/${taskId}/status`
          : `${BACKEND_API_BASE_URL}/api/assigned-tasks/${taskId}/status`;

      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.sr_no === taskId && task.source === source ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status."); 
    }
  };

  const handleDeleteTask = async (taskId, source) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
        return; 
    }
    try {
      const endpoint =
        source === "tasks"
          ? `${BACKEND_API_BASE_URL}/api/tasks/${taskId}`
          : `${BACKEND_API_BASE_URL}/api/assigned-tasks/${taskId}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });
      if (res.ok) {
          setTasks((prevTasks) =>
              prevTasks.filter((task) => !(task.sr_no === taskId && task.source === source))
          );
          alert("Task deleted successfully.");
      } else {
          const errorData = await res.json();
          alert(errorData.message || "Failed to delete task."); 
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Server error while deleting task."); 
    }
  };

  const downloadPDF = () => {
    if (!filteredTasks || filteredTasks.length === 0) {
      alert("No tasks to download.");
      return;
    }
    const doc = new jsPDF();
    const columns = ["Sr.No.", "Task", "Assigned Date", "Due Date", "Status", "Priority"];
    if (showAssignee) columns.push("Assignee");

    const rows = filteredTasks.map((task, index) => {
      const row = [
        index + 1,
        task.task,
        moment(task.assigned_date).format("YYYY-MM-DD"),
        moment(task.due_date).format("YYYY-MM-DD"),
        task.status,
        task.priority,
      ];
      if (showAssignee) row.push(task.assignee_name || "N/A");
      return row;
    });

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
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/send-tasks-email`, {
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


  const downloadWord = async () => {
    if (!filteredTasks || filteredTasks.length === 0) {
      alert("No tasks to download.");
      return;
    }

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
          properties: {}, 
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

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredTasks.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredTasks.length / entriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };


  return (
    <div className="tasks-table-container"> 
      <div className="table-controls-top"> 
        <div className="download-options">
          <div className="download-dropdown">
            <label htmlFor="download-select">Download All Tasks:</label>
            <select
              id="download-select"
              onChange={(e) => {
                if (e.target.value === "pdf") downloadPDF();
                if (e.target.value === "word") downloadWord();
                e.target.value = ""; 
              }}
            >
              <option value="">Select format</option>
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
            </select>
          </div>

          <button className="email-btn" onClick={sendTasksToEmail}>
            📧 Send to Email
          </button>
        </div>

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
      </div> 

      <div className="table-wrapper"> 
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
            {currentEntries.length > 0 ? ( 
              currentEntries.map((task, index) => (
                <tr key={`${task.source}-${task.sr_no || index}`}>
                  <td>{indexOfFirstEntry + index + 1}</td> 
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
              ))
            ) : (
              <tr>
                <td colSpan={showAssignee ? 8 : 7} style={{ textAlign: "center" }}>
                  No tasks found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> 

      <div className="table-controls-bottom"> 
        <ShowEntries
          entriesPerPage={entriesPerPage}
          onEntriesChange={handleEntriesPerPageChange}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div> 
    </div>
  );
};

export default TasksTable;

import { useState, useEffect } from "react";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import AssignTaskPopup from "../../components/AssignTaskPopup/AssignTaskPopup";
import "./Teams.css";

const Teams = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberEmail, setSelectedMemberEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const fetchAssignedTasks = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks-assigned-by-me?assignee_email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();
      setAssignedTasks(data);
    } catch (err) {
      console.error("Error fetching tasks assigned by me:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchAssignedTasks();
  }, []);

  const fetchMembers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) return;

      const res = await fetch(
        `http://localhost:5000/api/team-members?inviterEmail=${encodeURIComponent(
          user.email
        )}`
      );

      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handlePriorityChange = async (taskId, newPriority) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserEmail = user?.email;

    const res = await fetch(`http://localhost:5000/api/assigned-tasks/${taskId}/priority`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priority: newPriority,
        currentUserEmail: currentUserEmail  // ✅ match backend key
      }),
    });


    if (res.ok) {
      setAssignedTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.sr_no === taskId ? { ...t, priority: newPriority } : t
        )
      );
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update priority");
    }
  } catch (err) {
    console.error("Error updating priority:", err);
    alert("Error updating priority");
  }
};



  const handleInvite = async () => {
    if (!email) return;

    const inviterEmail = localStorage.getItem("userEmail");

    try {
      const res = await fetch("http://localhost:5000/api/invite-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, inviter_id: inviterEmail }),
      });

      const data = await res.json();
      alert(data.message);
      setEmail("");

      // Send notification to the invitee
      if (res.ok) {
        await fetch("http://localhost:5000/api/team-invite/notify-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inviter_email: inviterEmail,
            invitee_email: email,
          }),
        });
      }
    } catch (err) {
      console.error("Error sending invite:", err);
    }
  };

  const handleAssignTask = async (taskData) => {
    try {
      if (!taskData.task || !taskData.dueDate || !taskData.priority) {
        alert("All fields are required");
        return;
      }

      const payload = {
        task: taskData.task,
        due_date: taskData.dueDate,
        priority: taskData.priority,
        assignee_name: taskData.assigneeName,
        assignee_email: taskData.assigneeEmail,
        assigned_to_email: taskData.assignedToEmail,
      };

      const res = await fetch("http://localhost:5000/assign-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Task assigned successfully!");
        setIsModalOpen(false);
      } else {
        alert(data.message || "Failed to assign task");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task");
    }
  };

  return (
    <div className="teams-page">
      <SideNavbar />

      <div className="main-content">
        <h1 className="page-title">Team</h1>

        <section className="invite-section">
          <h2 className="section-title">Invite new members</h2>
          <div className="invite-form">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="invite-input"
            />
            <button onClick={handleInvite} className="btn-blue">
              Send invite
            </button>
          </div>
        </section>

        <section>
          <h2 className="section-title">Members</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <tr key={member.email}>
                      <td>{index + 1}</td>
                      <td className="member-name">{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <button
                          className="btn-blue small"
                          onClick={() => {
                            setSelectedMemberEmail(member.email);
                            setIsModalOpen(true);
                          }}
                        >
                          Assign task
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No team members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ✅ Moved Assigned Tasks section here */}
        <section>
          <h2 className="section-title">Tasks Assigned by Me</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Task</th>
                  <th>Assigned Date</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {assignedTasks.length > 0 ? (
                  assignedTasks.map((task, index) => {
                    const user = JSON.parse(localStorage.getItem("user"));
                    const currentUserEmail = user?.email;

                    return (
                      <tr key={task.sr_no || index}>
                        <td>{index + 1}</td>
                        <td>{task.task}</td>
                        <td>
                          {task.assigned_date
                            ? new Date(task.assigned_date).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>
                        <td>
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>
                        <td>
                          {task.assignee_email === currentUserEmail ? (
                            <select
                              className={`priority-dropdown priority-${(task.priority || "Medium").toLowerCase()}`}
                              value={task.priority || "Medium"}
                              onChange={(e) => handlePriorityChange(task.sr_no, e.target.value)}
                            >
                              <option value="High" className="priority-high">High</option>
                              <option value="Medium" className="priority-medium">Medium</option>
                              <option value="Low" className="priority-low">Low</option>
                            </select>
                          ) : (
                            task.priority || "N/A"
                          )}
                        </td>

                        <td>{task.assigned_to_email}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No tasks assigned by you yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {isModalOpen && (
        <AssignTaskPopup
          assignedToEmail={selectedMemberEmail}
          onClose={() => setIsModalOpen(false)}
          onAssign={handleAssignTask}
        />
      )}
    </div>
  );
};

export default Teams;

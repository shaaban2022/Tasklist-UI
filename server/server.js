import express from "express";
import mysql from "mysql2/promise"; 
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import pool from "./db.js"; 


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
app.use(cors()); 
app.use(express.json());


const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


transporter.verify((err, success) => {
  if (err) {
    console.error("Nodemailer transport verification failed:", err);
  } else {
    console.log("Nodemailer ready to send emails");
  }
});


app.post("/api/auth/signup", async (req, res) => {
  const { fullName, email, mobile, password, confirmPassword } = req.body;
  if (!fullName || !email || !mobile || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO users (fullName, email, mobile, password) VALUES (?, ?, ?, ?)",
      [fullName, email, mobile, hashed]
    );

    return res.status(201).json({ message: "Signup successful! Please log in." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = users[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });


    return res.json({ token: "dummy-token", user: { id: user.id, fullName: user.fullName, email: user.email, mobile: user.mobile } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});


app.post("/api/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {

    const users = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await query(
      "INSERT INTO otp_codes (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, expires_at=?",
      [email, otp, expiresAt, otp, expiresAt]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("send-otp error:", err);
    if (err && err.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({ message: "Required database table missing: " + err.message });
    }
    return res.status(500).json({ message: "Server error while sending OTP" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

  try {
    const otpRows = await query("SELECT * FROM otp_codes WHERE email = ? AND otp = ?", [email, otp]);
    if (otpRows.length === 0) return res.status(400).json({ message: "Invalid OTP" });

    const otpRow = otpRows[0];
    const expiresAt = new Date(otpRow.expires_at);
    if (Date.now() > expiresAt.getTime()) {
      await query("DELETE FROM otp_codes WHERE email = ?", [email]);
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);
    await query("DELETE FROM otp_codes WHERE email = ?", [email]);

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("reset-password error:", err);
    return res.status(500).json({ message: "Server error while resetting password" });
  }
});


app.post("/api/invite-member", async (req, res) => {
  try {
    const { email, inviter_id } = req.body;

    if (!email || !inviter_id) {
      return res.status(400).json({ message: "Email and inviter_id are required" });
    }

    const [inviterRows] = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [inviter_id]
    );

    if (inviterRows.length === 0) {
      return res.status(400).json({ message: "Inviter not found" });
    }

    const inviterEmail = inviterRows[0].email;
    if (inviterEmail.toLowerCase() === email.toLowerCase()) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    console.log("Invite request from:", inviter_id, "to:", email);

    const [userRows] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length > 0) {
      const [memberRows] = await pool.query(
        "SELECT * FROM team_members WHERE email = ? AND inviter_id = ?",
        [email, inviter_id]
      );

      if (memberRows.length > 0) {
        return res.status(400).json({ message: `${email} is already a team member.` });
      }
    }
    
    let emailSubject, emailHtml;

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:5000";

    if (userRows.length > 0) {

      await pool.query(
        "INSERT INTO team_invites (email, inviter_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status='pending'",
        [email, inviter_id, "pending"]
      );

      const acceptLink = `${backendBaseUrl}/api/accept-invite?email=${encodeURIComponent(email)}&inviter_id=${encodeURIComponent(inviter_id)}`;

      emailSubject = "Team Invitation";
      emailHtml = `
        <h2>You have been invited to join our team</h2>
        <p>Click the button below to accept:</p>
        <a href="${acceptLink}" style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;">Accept Invite</a>
      `;
    } else {
      const signupLink = `${frontendBaseUrl}/signup?email=${encodeURIComponent(email)}`;

      emailSubject = "Join Our Platform";
      emailHtml = `
        <h2>You have been invited to join the Tasklist UI platform</h2>
        <p>Please sign up first to join the team:</p>
        <a href="${signupLink}" style="padding:10px 20px;background:#2196F3;color:white;text-decoration:none;">Sign Up</a>
      `;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailSubject,
      html: emailHtml
    });

    res.json({
      message:
        userRows.length > 0
          ? `Team invite sent to ${email}`
          : `Signup invitation sent to ${email} - please let them know to check their email for the signup link and after signing up, send them the invite link again to join your team.`
    });
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).json({ message: "Error sending invite", error: err.message });
  }
});



app.get("/api/accept-invite", async (req, res) => {
  try {
    const { email, inviter_id } = req.query;

    if (!email || !inviter_id) {
      return res.status(400).send("Invalid request");
    }

    await pool.query(
      "UPDATE team_invites SET status = 'accepted' WHERE email = ? AND inviter_id = ?",
      [email, inviter_id]
    );

    await pool.query(
      "INSERT INTO team_members (name, email, inviter_id) VALUES (?, ?, ?)",
      [email.split("@")[0], email, inviter_id]
    );

    const notificationMessage = `${email} has accepted your team member request.`;
    await pool.query(
      "INSERT INTO notifications (user_email, assignee_email, message) VALUES (?, ?, ?)",
      [email, inviter_id, notificationMessage] 
    );

    res.send("<h2>Invite accepted! You are now part of the team.</h2>");
  } catch (err) {
    console.error("Error accepting invite:", err);
    res.status(500).send("Error accepting invite");
  }
});



app.get("/api/team-members", async (req, res) => {
  try {
    const inviterEmail = req.query.inviterEmail; 

    if (!inviterEmail) {
      return res.status(400).json({ message: "Inviter email is required" });
    }

    const [rows] = await pool.query(
      "SELECT name, email FROM team_members WHERE inviter_id = ?",
      [inviterEmail]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: "Error fetching members" });
  }
});


app.put("/api/user/update-profile", async (req, res) => {
  const { id, fullName, mobile } = req.body;

  if (!id || !fullName) {
    return res.status(400).json({ message: "User ID and fullName are required" });
  }

  try {
    await query(
      "UPDATE users SET fullName = ?, mobile = ? WHERE id = ?",
      [fullName, mobile || null, id]
    );

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Server error while updating profile" });
  }
});


app.delete("/api/user/delete-account", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await pool.query("DELETE FROM users WHERE email = ?", [email]);

    await pool.query("DELETE FROM team_members WHERE email = ?", [email]);
    await pool.query("DELETE FROM team_invites WHERE email = ?", [email]);

    return res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ message: "Server error while deleting account" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { task, due_date, priority, assignee_name, assignee_email } = req.body;

    if (!task || !due_date || !priority || !assignee_name || !assignee_email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const nowUtc = new Date();
      const assigned_date_ist = new Date(nowUtc.getTime() + (5.5 * 60 * 60 * 1000));
      const formatted_assigned_date_ist = assigned_date_ist.toISOString().slice(0, 19).replace('T', ' ');

      await query(
        `INSERT INTO tasks (task, assigned_date, due_date, priority, assignee_name, assignee_email)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [task, formatted_assigned_date_ist, due_date, priority, assignee_name, assignee_email]
    );

    res.json({ message: "Task added successfully" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Server error while adding task" });
  }
});

app.put("/api/tasks/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pointsPerTask = 10; 

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const [rows] = await pool.query(
      "SELECT assignee_email, status FROM tasks WHERE sr_no = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = rows[0];
    const assigneeEmail = task.assignee_email;
    const prevStatus = task.status;

    await pool.query("UPDATE tasks SET status = ? WHERE sr_no = ?", [status, id]);

    if (prevStatus !== "Completed" && status === "Completed") {
      await pool.query(
        `INSERT INTO user_points (user_email, points)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE points = points + ?`,
        [assigneeEmail, pointsPerTask, pointsPerTask]
      );
    } else if (prevStatus === "Completed" && status !== "Completed") {
      await pool.query(
        `UPDATE user_points
          SET points = GREATEST(points - ?, 0)
          WHERE user_email = ?`,
        [pointsPerTask, assigneeEmail]
      );
    }

    res.json({ message: "Task status updated and points adjusted successfully" });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Server error while updating task status" });
  }
});



app.post("/assign-task", async (req, res) => {
  try {
    const {
      task,
      due_date,
      priority,
      assignee_name,
      assignee_email,
      assigned_to_email
    } = req.body;

    if (!task || !due_date || !priority || !assignee_name || !assignee_email || !assigned_to_email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const insertQuery = `
      INSERT INTO assigned_tasks (task, due_date, priority, assignee_name, assignee_email, assigned_to_email)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [task, due_date, priority, assignee_name, assignee_email, assigned_to_email]);

    const normalizedAssignedEmail = assigned_to_email.trim().toLowerCase();
    const normalizedAssigneeEmail = assignee_email.trim().toLowerCase();
    const message = `You have been assigned a new task: "${task}" by ${normalizedAssigneeEmail}`;

    const notificationQuery = `
      INSERT INTO notifications (user_email, assignee_email, message)
      VALUES (?, ?, ?)
    `;
    await pool.query(notificationQuery, [normalizedAssigneeEmail, normalizedAssignedEmail, message]);

    res.json({ message: "Task assigned successfully and notification sent" });

  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Error assigning task" });
  }
});


app.get("/api/assigned-tasks", async (req, res) => {
  try {
    const { assigned_to_email } = req.query;

    if (!assigned_to_email) {
      return res.status(400).json({ message: "assigned_to_email is required" });
    }

    const [rows] = await pool.query(
      "SELECT *, 'assigned_tasks' AS source FROM assigned_tasks WHERE assigned_to_email = ?",
      [assigned_to_email]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching assigned tasks:", err);
    res.status(500).json({ message: "Server error while fetching assigned tasks" });
  }
});

app.put("/api/assigned-tasks/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pointsPerTask = 10; 

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const [rows] = await pool.query(
      "SELECT assigned_to_email, status FROM assigned_tasks WHERE sr_no = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = rows[0];
    const assigneeEmail = task.assigned_to_email;
    const prevStatus = task.status;

    await pool.query("UPDATE assigned_tasks SET status = ? WHERE sr_no = ?", [
      status,
      id,
    ]);

    if (prevStatus !== "Completed" && status === "Completed") {

      await pool.query(
        `INSERT INTO user_points (user_email, points)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE points = points + ?`,
        [assigneeEmail, pointsPerTask, pointsPerTask]
      );
    } else if (prevStatus === "Completed" && status !== "Completed") {
      await pool.query(
        `UPDATE user_points
          SET points = GREATEST(points - ?, 0)
          WHERE user_email = ?`,
        [pointsPerTask, assigneeEmail]
      );
    }

    res.json({ message: "Assigned task status updated and points adjusted successfully" });
  } catch (err) {
    console.error("Error updating assigned task status:", err);
    res.status(500).json({ message: "Server error while updating assigned task status" });
  }
});


app.get("/api/user-tasks", async (req, res) => {
  try {
    const { assignee_email } = req.query;

    if (!assignee_email) {
      return res.status(400).json({ message: "assignee_email is required" });
    }

    const [rows] = await pool.query(
      `SELECT sr_no, task, assigned_date, due_date, status, priority,
            'Me' AS assignee_name,
            'tasks' AS source
        FROM tasks
        WHERE assignee_email = ?`,
      [assignee_email]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching user tasks:", err);
    res.status(500).json({ message: "Server error while fetching user tasks" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM tasks WHERE sr_no = ?`, [id]);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

app.delete("/api/assigned-tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [taskRows] = await pool.query(
      "SELECT assigned_to_email, assignee_email, task FROM assigned_tasks WHERE sr_no = ?",
      [id]
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ message: "Assigned task not found" });
    }

    const { assigned_to_email, assignee_email, task } = taskRows[0];
    const normalizedAssignedEmail = assigned_to_email.trim().toLowerCase();
    const normalizedAssigneeEmail = assignee_email.trim().toLowerCase();

    await pool.query(`DELETE FROM assigned_tasks WHERE sr_no = ?`, [id]);

    const message = `The task "${task}" assigned to ${normalizedAssignedEmail} has been deleted.`;

    await pool.query(
      "INSERT INTO notifications (user_email, assignee_email, message) VALUES (?, ?, ?)",
      [normalizedAssignedEmail, normalizedAssigneeEmail, message]
    );

    res.json({
      message: "Assigned task deleted and notification sent",
      assigned_to_email
    });
  } catch (err) {
    console.error("Error deleting assigned task:", err);
    res.status(500).json({ message: "Server error while deleting assigned task" });
  }
});

setInterval(async () => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours
    const [result] = await pool.query(
      "DELETE FROM notifications WHERE seen_at IS NOT NULL AND seen_at <= ?",
      [twoHoursAgo]
    );
    if (result.affectedRows > 0) console.log("Deleted old notifications:", result.affectedRows);
  } catch (err) {
    console.error("Error deleting old notifications:", err);
  }
}, 10 * 60 * 1000);


app.get("/api/notifications", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();

    const [notifications] = await pool.query(
      `SELECT id, user_email, assignee_email, message, created_at
        FROM notifications
        WHERE LOWER(assignee_email) = ?
        ORDER BY created_at DESC`,
      [normalizedEmail]
    );

    const now = new Date();
    await pool.query(
      "UPDATE notifications SET seen_at = ? WHERE LOWER(assignee_email) = ? AND seen_at IS NULL",
      [now, normalizedEmail]
    );


    res.json(notifications); 
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error while fetching notifications" });
  }
});

app.post("/api/team-invite/notify-request", async (req, res) => {
  try {
    const { inviter_email, invitee_email } = req.body;

    if (!inviter_email || !invitee_email) {
      return res.status(400).json({ message: "inviter_email and invitee_email are required" });
    }

    const notificationMessage = `${inviter_email} has sent you a team join request.`;

    await pool.query(
      "INSERT INTO notifications (user_email, assignee_email, message) VALUES (?, ?, ?)",
      [inviter_email, invitee_email, notificationMessage]
    );

    res.json({ message: `Notification sent to ${inviter_email}` });
  } catch (err) {
    console.error("Error sending team invite notification:", err);
    res.status(500).json({ message: "Server error while sending team invite notification" });
  }
});


app.post("/api/notifications/mark-seen", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await pool.query(
      "UPDATE notifications SET seen = 1 WHERE LOWER(assignee_email) = ?",
      [email.toLowerCase()]
    );

    res.json({ message: "Notifications marked as seen" });
  } catch (err) {
    console.error("Error marking notifications as seen:", err);
    res.status(500).json({ message: "Server error while marking notifications as seen" });
  }
});

app.post("/api/send-tasks-email", async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const ownTasks = await query(
      "SELECT task, assigned_date, due_date, priority, status, assignee_name FROM tasks WHERE assignee_email = ?",
      [userEmail]
    );

    const assignedTasks = await query(
      "SELECT task, assigned_date, due_date, priority, status, assignee_name FROM assigned_tasks WHERE assigned_to_email = ?",
      [userEmail]
    );

    const allTasks = [...ownTasks, ...assignedTasks];

    if (!allTasks.length) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    let taskListHtml = `
      <h2>Your Task List</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Task</th>
          <th>Assigned Date</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assignee</th>
        </tr>
    `;

    allTasks.forEach(task => {
      taskListHtml += `
        <tr>
          <td>${task.task}</td>
          <td>${task.assigned_date ? new Date(task.assigned_date).toLocaleDateString() : "N/A"}</td>
          <td>${task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}</td>
          <td>${task.priority}</td>
          <td>${task.status}</td>
          <td>${task.assignee_name || "N/A"}</td>
        </tr>
      `;
    });

    taskListHtml += "</table>";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Task List",
      html: taskListHtml
    });

    res.json({ message: "Tasks sent to your email successfully!" });

  } catch (error) {
    console.error("Error sending tasks email:", error);
    res.status(500).json({ message: "Failed to send tasks email" });
  }
});

app.get("/api/tasks-assigned-by-me", async (req, res) => {
  try {
    const { assignee_email } = req.query;

    if (!assignee_email) {
      return res.status(400).json({ message: "assignee_email is required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM assigned_tasks WHERE assignee_email = ?",
      [assignee_email]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks assigned by user:", err);
    res.status(500).json({ message: "Server error while fetching tasks assigned by you" });
  }
});

app.put("/api/assigned-tasks/:id/priority", async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, currentUserEmail } = req.body;

    if (!priority || !currentUserEmail) {
      return res.status(400).json({ message: "Priority and currentUserEmail are required" });
    }

    const [rows] = await pool.query(
      "SELECT assignee_email FROM assigned_tasks WHERE sr_no = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (rows[0].assignee_email.trim().toLowerCase() !== currentUserEmail.trim().toLowerCase()) {
      return res.status(403).json({ message: "Not authorized to change this task's priority" });
    }

    await pool.query(
      "UPDATE assigned_tasks SET priority = ? WHERE sr_no = ?",
      [priority, id]
    );

    res.json({ message: "Priority updated successfully" });
  } catch (err) {
    console.error("Error updating assigned task priority:", err);
    res.status(500).json({ message: "Server error while updating priority" });
  }
});


app.get("/api/user-points", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const [rows] = await pool.query(
      "SELECT points FROM user_points WHERE user_email = ?",
      [email]
    );

    const points = rows.length ? rows[0].points : 0;
    res.json({ points });
  } catch (err) {
    console.error("Error fetching user points:", err);
    res.status(500).json({ points: 0 });
  }
});


app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});


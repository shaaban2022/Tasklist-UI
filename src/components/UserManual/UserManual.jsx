import { useState } from 'react';
import { motion } from 'framer-motion';
import './UserManual.css'; 

const UserManual = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "We are soon adding a 'Forgot Password' feature in the Login screen. After that you can easily reset your password."
    },
    {
      question: "How to create a new task or team?",
      answer: "Navigate to the Dashboard, click 'Add Task', fill in the details and save."
    },
    {
      question: "How to delete my account?",
      answer: "We are soon adding a 'Delete Account' feature in the Account Settings. After that you can easily delete your account."
    }
  ];

  const featureList = [
    {
      icon: '📊',
      title: 'Dashboard Overview',
      description: 'Get a quick glance at your total, completed, in-progress, and not-started tasks.'
    },
    {
      icon: '📋',
      title: 'Personal Task Management',
      description: 'Create, update status, and delete your individual tasks with ease.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Invite members, assign tasks, and manage team assignments effectively.'
    },
    {
      icon: '🔔',
      title: 'Real-time Notifications',
      description: 'Stay updated with instant alerts for team invites and task changes.'
    },
    {
      icon: '⭐',
      title: 'Gamified Task Completion',
      description: 'Earn points for every task you complete and track your progress.'
    },
    {
      icon: '📧',
      title: 'Email Integration',
      description: 'Send task lists to your email for easy access and record-keeping.'
    },
    {
      icon: '📄',
      title: 'Task Export',
      description: 'Download your task lists as PDF or Word documents for offline use.'
    },
    {
      icon: '📅',
      title: 'Calendar View',
      description: 'Visualize your tasks on an interactive calendar with different view options.'
    },
    {
      icon: '🔒',
      title: 'Secure User Authentication',
      description: 'Secure signup, login, and password reset functionalities with OTP verification.'
    }
  ];

  return (
    <div className="user-manual-layout">
      <div className="user-manual-content">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="manual-header"
        >
          <h1>Tasklist UI: User Manual 📚</h1>
          <p>
            Welcome to Tasklist UI, your personal and team task management solution!
            This manual will guide you through all the features and functionalities of the application.
          </p>
        </motion.header>

        <hr />

        <section className="manual-section">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            🚀 Getting Started
          </motion.h2>
          <h3>Accessing the Application</h3>
          <p>
            To begin using Tasklist UI, open your web browser and navigate to the deployed frontend URL,
            for instance: <code>https://tasklist-frontend-p2pl.onrender.com</code>.
          </p>
        </section>

        <hr />

        <section className="manual-section">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            🔒 Account Management
          </motion.h2>

          <div className="sub-section">
            <h4>1. Sign Up</h4>
            <p>If you're a new user, click on the **"Signup"** link on the navigation bar or the login page.</p>
            <ul>
              <li>**Fill in your details**: Provide your full name, email ID, mobile number, and create a strong password.</li>
              <li>**Confirm password**: Re-enter your password to ensure accuracy.</li>
              <li>**"Remember Me"**: Optionally, check this box to stay logged in.</li>
              <li>Click **"Sign Up"** to create your account.</li>
              <li>You can also choose to sign up using **Google** or **Microsoft** accounts (functionality to be implemented in the future).</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>2. Login</h4>
            <p>If you already have an account, click on the **"Login"** link on the navigation bar or the main page.</p>
            <ul>
              <li>**Enter your credentials**: Provide your registered email and password.</li>
              <li>Click **"Login"** to access your dashboard.</li>
              <li>**Forgot Password?**: If you forget your password, click the "Reset Password" link on the login page. You'll be prompted to enter your email to receive an OTP, then you can set a new password using the OTP.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>3. Update Profile</h4>
            <p>Once logged in, navigate to the **"Account"** section from the side navigation bar.</p>
            <ul>
              <li>You'll see your current profile information: full name, email, and mobile number.</li>
              <li>Click **"Update Profile"** to change your name or mobile number.</li>
              <li>A popup will appear where you can edit the fields. Click **"Update"** to save changes or **"Cancel"** to discard.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>4. Delete Account</h4>
            <p>From the **"Account"** page:</p>
            <ul>
              <li>Click the **"Delete Account"** button.</li>
              <li>A confirmation popup will appear asking if you are sure. This action cannot be undone.</li>
              <li>Click **"Yes, Delete"** to permanently remove your account or **"Cancel"** to keep it.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>5. Logout</h4>
            <p>To securely exit your session, click the **"Logout"** button in the profile dropdown menu (top right corner of the dashboard) or on the **"Account"** page. This will clear your session data and redirect you to the login page.</p>
          </div>
        </section>

        <hr />

        <section className="manual-section">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            📋 Core Features
          </motion.h2>

          <div className="features-grid">
            {featureList.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="sub-section">
            <h4>1. Dashboard 📊</h4>
            <p>The Dashboard is your central hub, providing a quick overview of your tasks.</p>
            <ul>
              <li>**Task Statistics**: See a summary of your:
                <ul>
                  <li>**Total Tasks**</li>
                  <li>**Completed Tasks**</li>
                  <li>**Not Started Tasks**</li>
                  <li>**In-Progress Tasks**</li>
                </ul>
              </li>
              <li>**Task Details Table**: Below the summary, you'll find a table listing your tasks.</li>
              <li>**Add Task Button**: A prominent button to quickly add a new task.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>2. Task Management (Tasks Page)</h4>
            <p>Navigate to the **"Tasks"** section using the side navigation bar. This page offers two views for managing your tasks: **List** and **Calendar**.</p>

            <h5>List View (Default)</h5>
            <ul>
              <li>**Filters**: You can filter your tasks by:
                <ul>
                  <li>**Status**: "Not Started", "In Progress", "Completed"</li>
                  <li>**Due Date**: "Due soon" (oldest first), "Due later" (newest first), or default sorting.</li>
                  <li>**Priority**: "High", "Medium", "Low"</li>
                </ul>
              </li>
              <li>**Task Details**: Each row displays:
                <ul>
                  <li>Sr. No.</li>
                  <li>Task Title</li>
                  <li>Assigned Date</li>
                  <li>Due Date</li>
                  <li>Status (with a dropdown to update)</li>
                  <li>Priority (with a badge)</li>
                  <li>Assignee (if applicable)</li>
                  <li>Actions (currently, a "Delete" button for completed tasks)</li>
                </ul>
              </li>
              <li>**Update Status**: Easily change a task's status using the dropdown menu in the "Status" column.</li>
              <li>**Delete Task**: For tasks marked "Completed", a "Delete" button appears, allowing you to remove them from your list.</li>
            </ul>

            <h5>Calendar View</h5>
            <ul>
              <li>Switch to the "Calendar" tab to visualize your tasks on a calendar.</li>
              <li>**Navigation**: Use the "Today", "Back", "Next", "Prev Day", and "Next Day" buttons to navigate the calendar.</li>
              <li>**Views**: Toggle between "Month", "Week", and "Day" views.</li>
              <li>Tasks are displayed on their respective due dates, making it easy to plan your schedule.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>3. Add New Task</h4>
            <p>You can add a new task from two locations:</p>
            <ul>
              <li>**Dashboard**: Click the **"+ Add Task"** button.</li>
              <li>**Add New Task Page**: Click **"Add New Task"** in the side navigation.</li>
              <li>A **popup** will appear requiring:
                <ul>
                  <li>**Task Title**: A brief description of your task.</li>
                  <li>**Date**: The due date and time for the task.</li>
                  <li>**Priority**: Choose "High", "Medium", or "Low".</li>
                </ul>
              </li>
              <li>Click **"Add Task"** to save or **"Cancel"** to close. Newly added tasks will appear in your Dashboard and Tasks list.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>4. Team Collaboration (Teams Page)</h4>
            <p>The "Teams" section allows you to invite and manage team members and tasks assigned by you.</p>

            <h5>Invite New Members</h5>
            <ul>
              <li>Enter the **email address** of the person you wish to invite.</li>
              <li>Click **"Send invite"**. An invitation will be sent, and they will receive a real-time notification upon acceptance.</li>
            </ul>

            <h5>Members Table</h5>
            <ul>
              <li>View a list of your team members, including their name and email ID.</li>
              <li>**Assign Task**: Next to each member's entry, a "Assign task" button allows you to assign a task directly to that team member. A popup similar to the "Add New Task" popup will appear, pre-filled with the assignee's email.</li>
            </ul>

            <h5>Tasks Assigned by Me</h5>
            <ul>
              <li>This table lists tasks that **you** have assigned to others.</li>
              <li>You can view the task details, assigned date, due date, priority, and who it was assigned to.</li>
              <li>**Update Priority**: For tasks you assigned, you can directly change the priority using a dropdown in the table.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>5. Real-time Notifications 🔔</h4>
            <ul>
              <li>The bell icon in the top right corner of the navigation bar indicates new notifications.</li>
              <li>Click on the bell icon to view a dropdown of your notifications. This includes alerts about accepted team invites and deleted assigned tasks.</li>
              <li>The red dot on the bell indicates unread notifications.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>6. Gamified Task Completion ⭐</h4>
            <ul>
              <li>Earn points for completing tasks! Your current points balance is displayed in the top right corner of the navigation bar, next to the notification icon.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>7. Email Integration 📧</h4>
            <ul>
              <li>**Send Tasks to Email**: On the "Tasks" page (List View), you can click the "📧 Send to Email" button to receive your complete task list in your registered email inbox.</li>
            </ul>
          </div>

          <div className="sub-section">
            <h4>8. Task Export 📄</h4>
            <p>On the "Tasks" page (List View), you can download your tasks in various formats:</p>
            <ul>
              <li>**Download All Tasks**:
                <ul>
                  <li>**PDF**: Select "PDF" from the dropdown to generate and download a PDF document of your tasks.</li>
                  <li>**Word**: Select "Word" from the dropdown to generate and download a Microsoft Word document of your tasks.</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        <hr />

        <section className="manual-section">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            🔮 Future Enhancements
          </motion.h2>
          <p>
            We are continuously working to improve Tasklist UI! Future updates will include:
          </p>
          <ul>
            <li>**Google and Microsoft Social Login**: Directly sign in using your existing Google and Microsoft accounts.</li>
            <li>**Enhanced Task Editing**: More robust options for modifying existing tasks.</li>
            <li>**Full Search Functionality**: Comprehensive search across all tasks and team members.</li>
            <li>**External Calendar Integration**: Seamlessly integrate with Google Calendar and Outlook Calendar for unified scheduling.</li>
            <li>**Slack Integration**: Receive task notifications and updates directly in Slack.</li>
          </ul>
        </section>

        <hr />

        <section className="manual-section">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            📞 Support
          </motion.h2>
          <p>
            If you encounter any issues or have questions, please visit the **"Support"** page.
          </p>
          <ul>
            <li>**Contact Information**: Find our email and phone number for direct assistance.</li>
            <li>**Live Chat**: Live chat support is available from 9 AM to 6 PM.</li>
            <li>**Submit a Support Request**: Fill out the contact form with your name, email, and message to send us a detailed request.</li>
            <li>**Frequently Asked Questions (FAQ)**: Browse common questions and their answers for quick solutions.</li>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="faq-question">❓ {faq.question}</div>
                {openFaqIndex === index && <motion.div
                  className="faq-answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >{faq.answer}</motion.div>}
              </motion.div>
            ))}
          </ul>
        </section>

        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="manual-footer"
        >
          <p>
            We hope you enjoy using Tasklist UI to streamline your productivity!
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default UserManual;
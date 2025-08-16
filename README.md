Okay, I will generate a comprehensive README.md file for your entire Tasklist UI project (both frontend and backend), integrating the details you've provided and adding all the information about authentication, user management, and deployment.

This README will be structured to cover both the frontend and backend aspects, their respective features, technologies, and deployment instructions.

-----

# 🗂 Tasklist UI

A **full-stack task management application** designed to help individuals and teams organize, track, and manage their tasks efficiently. It features a robust backend API and a dynamic React-based user interface, offering both list and calendar views of tasks.

-----

## 🚀 Features

### Core Features

  * 📋 **Personal Task Management** – Create, view, update status, and delete your own tasks.
  * 👥 **Team Collaboration** – Invite team members via email, assign tasks to them, and manage assigned tasks.
  * 🔔 **Real-time Notifications** – Get notified about accepted team invites and deleted assigned tasks.
  * 🔒 **Secure User Authentication** – Signup, login, and password reset functionalities with OTP verification.
  * ⭐ **Gamified Task Completion** – Earn points for completing tasks.
  * 📧 **Email Integration** – Send OTPs for password reset and comprehensive task lists to email.
  * 📊 **Dashboard Overview** – A personal dashboard showing task statistics (total, completed, in-progress, not started).
  * 📅 **Calendar View** – Visualize tasks on a calendar with month/week/day navigation using `react-big-calendar`.
  * 📄 **Task Export** – Download task lists as PDF or Word documents.
  * 🗑️ **Account Management** – Update profile details and securely delete your account.

-----

## 🛠 Tech Stack

The project is divided into a frontend (UI) and a backend (API) service.

### Frontend

  * **React** – Frontend library for building user interfaces.
  * **Vite** – Fast build tool and development server.
  * **React Router DOM** – For declarative routing in React applications.
  * **Axios / Fetch API** – For making HTTP requests to the backend.
  * **`react-big-calendar`** – A flexible and highly customizable calendar component.
  * **`moment` / `date-fns`** – For robust date and time manipulation.
  * **`framer-motion`** – For smooth animations and transitions.
  * **`docx` & `file-saver`** – For generating and downloading Word documents.
  * **`jspdf` & `jspdf-autotable`** – For generating and downloading PDF documents.
  * **Tailwind CSS (implied by class names like `text-3xl`, `bg-indigo-600`)** – Utility-first CSS framework for rapid UI development.
  * **`lucide-react`, `@heroicons/react`, `react-icons`** – For UI icons.

### Backend

  * **Node.js** – JavaScript runtime environment.
  * **Express.js** – Web framework for building RESTful APIs.
  * **MySQL2 (with Promises)** – MySQL client for Node.js, providing promise-based API.
  * **`cors`** – Middleware for enabling Cross-Origin Resource Sharing.
  * **`bcrypt`** – For hashing and salting passwords securely.
  * **`jsonwebtoken`** – For implementing JSON Web Tokens for authentication.
  * **`nodemailer`** – For sending emails (e.g., OTPs, task summaries, invites).
  * **`dotenv`** – For loading environment variables from a `.env` file in development.

-----

## 📂 Project Structure

```
.
├── backend/                  # Node.js Express API
│   ├── db.js                 # Database connection pool setup
│   ├── server.js             # Main Express application, API routes
│   ├── package.json
│   └── package-lock.json
├── frontend/                 # React Vite UI
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Images, logos
│   │   ├── components/       # Reusable UI components (e.g., LoginForm, SideNavbar, AddTaskPopup)
│   │   │   ├── AddTaskPopup/AddTaskPopup.jsx
│   │   │   ├── LoginForm/LoginForm.jsx
│   │   │   ├── Navbar/Navbar.jsx
│   │   │   └── ... (other components)
│   │   ├── pages/            # Page-level components (e.g., Dashboard, Tasks, Account)
│   │   │   ├── Dashboard/Dashboard.jsx
│   │   │   ├── Tasks/Tasks.jsx
│   │   │   ├── Teams/Teams.jsx
│   │   │   └── ... (other pages)
│   │   ├── App.jsx           # Main application router
│   │   ├── index.css
│   │   └── main.jsx          # Entry point for React app
│   ├── index.html            # Main HTML file
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js        # Vite build configuration
└── README.md
```

-----

## ⚙️ Installation & Local Setup

### 1\. Prerequisites

  * **Node.js** (v18 or higher recommended) and **npm** installed.
  * **MySQL Server** running locally (e.g., via XAMPP, Docker, or direct installation).
  * A **Gmail account** for Nodemailer, with App Passwords enabled for `EMAIL_PASS`.

### 2\. Database Setup

  * Create a MySQL database (e.g., `tasklistdb`).
  * Import your SQL dump file (`tasklistdb_backup.sql`) into this database. You can use MySQL CLI or PHPMyAdmin.
    ```bash
    mysql -h localhost -P 3306 -u root -p tasklistdb < path/to/your/tasklistdb_backup.sql
    ```
    *(Replace `localhost`, `3306`, `root`, `tasklistdb`, and path/to/your/ with your local MySQL credentials and dump file path)*

### 3\. Backend Setup

1.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file in the `backend/` directory with your local database and email credentials:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_root_password
    DB_NAME=tasklistdb
    JWT_SECRET=supersecretkey # Use a strong, random key for production!

    EMAIL_USER=your_gmail_email@gmail.com
    EMAIL_PASS=your_gmail_app_password
    ```
    *(Replace placeholders with your actual values)*
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The backend will run on `http://localhost:5000`.

### 4\. Frontend Setup

1.  Navigate to the `frontend/` directory (from the project root):
    ```bash
    cd frontend
    ```
2.  Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_BACKEND_URL=http://localhost:5000
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and go to: `http://localhost:5173`

-----

## 🚀 Deployment on Render

This project is configured for deployment on [Render](https://render.com/).

### Backend Deployment

1.  **Prepare Backend Code:** Ensure your backend code (especially `server.js` and `db.js`) is updated to use environment variables (`MYSQL_ADDON_HOST`, `MYSQL_ADDON_USER`, `MYSQL_ADDON_PASSWORD`, `MYSQL_ADDON_DB`, `MYSQL_ADDON_PORT`, `FRONTEND_URL`, `BACKEND_URL`, `EMAIL_USER`, `EMAIL_PASS`, `JWT_SECRET`) instead of hardcoded `localhost` values. (This has already been done in the provided updated code).
2.  **Git Repository:** Push your `backend/` folder (excluding `node_modules` and `.env`) to a **separate GitHub repository**.
3.  **Create Web Service on Render:**
      * Log in to Render and click "New" \> "Web Service".
      * Connect your backend GitHub repository.
      * **Name:** `tasklist-backend-api` (or your chosen name).
      * **Region:** Select a region close to your Clever Cloud MySQL database (e.g., a European region if Clever Cloud is in Paris).
      * **Root Directory:** If your `backend` code is in a `backend/` folder, set this to `backend`.
      * **Build Command:** `npm install`
      * **Start Command:** `npm start`
      * **Environment Variables:** Add the following **Render environment variables**:
          * `MYSQL_ADDON_DB`: `bugoisvx8bzrtxk2hjqb`
          * `MYSQL_ADDON_HOST`: `bugoisvx8bzrtxk2hjqb-mysql.services.clever-cloud.com`
          * `MYSQL_ADDON_PASSWORD`: `J2TWKhIA261cZowXdUhG`
          * `MYSQL_ADDON_PORT`: `3306`
          * `MYSQL_ADDON_USER`: `u2z6aolmen3sc0ns`
          * `MYSQL_ADDON_URI`: `mysql://u2z6aolmen3sc0ns:J2TWKhIA261cZowXdUhG@bugoisvx8bzrtxk2hjqb-mysql.services.clever-cloud.com:3306/bugoisvx8bzrtxk2hjqb`
          * `JWT_SECRET`: (A strong, unique secret key for production)
          * `EMAIL_USER`: (Your Gmail email, same as `.env`)
          * `EMAIL_PASS`: (Your Gmail App Password, same as `.env`)
          * `NODE_ENV`: `production`
          * `FRONTEND_URL`: (Will be added *after* frontend deployment, e.g., `https://tasklist-frontend-p2pl.onrender.com`)
          * `BACKEND_URL`: `https://tasklist-backend-api.onrender.com` (Your backend's public URL once deployed)
      * Click "Create Web Service".

### Frontend Deployment

1.  **Prepare Frontend Code:** Ensure your frontend code (e.g., `AddTaskPopup.jsx`, `LoginForm.jsx`, `TasksTable.jsx`, `Teams.jsx`, `vite.config.js`) is updated to use `import.meta.env.VITE_BACKEND_URL` for API calls and configured for Render's port binding and `allowedHosts`. (This has already been done in the provided updated code).
2.  **Git Repository:** Push your `frontend/` folder (excluding `node_modules` and `.env`) to a **separate GitHub repository**.
3.  **Update Google OAuth Client Credentials:** Go to your Google Cloud Console \> APIs & Services \> Credentials. Edit your OAuth 2.0 Client ID to add your deployed frontend URL (`https://tasklist-frontend-p2pl.onrender.com`) to **Authorized JavaScript origins** and **Authorized redirect URIs**.
4.  **Create Web Service on Render:**
      * Log in to Render and click "New" \> "Web Service".
      * Connect your frontend GitHub repository.
      * **Name:** `tasklist-frontend-p2pl` (or your chosen name).
      * **Region:** Select the same region as your backend for optimal performance.
      * **Root Directory:** If your `frontend` code is in a `frontend/` folder, set this to `frontend`.
      * **Build Command:** `npm install && npm run build`
      * **Start Command:** `npm run preview`
      * **Environment Variables:** Add:
          * `VITE_BACKEND_URL`: `https://tasklist-backend-api.onrender.com` (Your deployed backend's public URL)
          * `NODE_ENV`: `production`
      * Click "Create Web Service".

### Post-Deployment

  * **Update Backend's `FRONTEND_URL`:** Once your frontend is deployed and you have its public URL (`https://tasklist-frontend-p2pl.onrender.com`), go back to your **backend service** settings on Render, navigate to the **"Environment"** tab, edit `FRONTEND_URL`, and set its value to your frontend's public URL. Save changes to trigger a redeploy of the backend.
  * **Test:** Access your deployed frontend URL (`https://tasklist-frontend-p2pl.onrender.com`) to test the full application.

-----

## 📸 Project Views (Frontend)

### Dashboard

> Provides an overview of task statistics.

### Tasks List View

> Shows tasks in a structured table format with filtering and sorting options.

### Tasks Calendar View

> Displays tasks visually on a month/week/day calendar for better planning.

-----

## 🔮 Future Improvements

  * Implement Google and Microsoft social login functionalities.
  * Enhance task editing capabilities.
  * Implement full search functionality for tasks.
  * Integrate with external calendar services (Google Calendar, Outlook Calendar).
  * Add Slack integration for notifications.

-----

## 📄 License

This project is licensed under the **MIT License**.

-----

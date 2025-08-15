# 🗂 Tasklist UI

A **React-based task management interface** featuring two main views:  
- **List View**: Displays tasks in a structured table format.  
- **Calendar View**: Shows tasks on a calendar with day/week/month navigation.  

Includes **Next/Back month controls**, **day-by-day navigation**, and **highlighted events** in blue.  

---

## 🚀 Features

- 📋 **Task List View** – See all tasks with start/end dates, status, priority, and assignee avatars.  
- 📅 **Calendar View** – Display tasks visually on a calendar using `react-big-calendar`.  
- 🔄 **Month & Day Navigation** – Move forward/backward in months and days with custom toolbar controls.  
- 🎯 **Today Button** – Jump instantly to today’s date.  
- 🎨 **Styled Events** – Blue-highlighted task events for better visibility.  
- 🖱 **Simple Add Button** – Easy "Add Task" button for future expansion.  

---

## 🛠 Tech Stack

- **React** – Frontend library  
- **Vite** – Fast build tool and dev server  
- **react-big-calendar** – Calendar UI  
- **moment** – Date handling  
- **CSS Modules** – Custom styling  

---

## 📂 Project Structure

```

src/
├── components/
│   └── SideNavbar.jsx
├── pages/
│   └── Tasks.jsx
│   
├── App.jsx
└── main.jsx

````

---

## ⚙️ Installation & Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install required packages**

   ```bash
   npm install react-big-calendar moment
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Go to: `http://localhost:5173`

---

## 📸 Tasks Views

### List View

> Shows tasks in a table format with details.

### Calendar View

> Displays tasks visually on a month/week/day calendar.

---

## 🔮 Future Improvements

* ✅ Add task creation form 
* ✅ Task editing & deletion
* ✅ Backend integration 
* ✅ Assign Task page
* ✅ Calendar page in SideNavbar
---

## 📄 License

This project is licensed under the **MIT License**.

```


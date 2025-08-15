import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaTasks, FaUsers, FaCalendarAlt, FaUserCircle, FaBars, FaPlusCircle } from "react-icons/fa";
import "./SideNavbar.css";

const SideNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // sidebar open state

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={isOpen ? "sidebar open" : "sidebar closed"}>
      <div className="sidebar-header">
        <h2>MyApp</h2>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <ul>
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard">
            <FaTachometerAlt className="icon" />
            {isOpen && "Dashboard"}
          </Link>
        </li>
        <li className={isActive("/tasks") ? "active" : ""}>
          <Link to="/tasks">
            <FaTasks className="icon" />
            {isOpen && "Tasks"}
          </Link>
        </li>
        <li className={isActive("/teams") ? "active" : ""}>
          <Link to="/teams">
            <FaUsers className="icon" />
            {isOpen && "Teams"}
          </Link>
        </li>
        <li className={isActive("/calendar") ? "active" : ""}>
          <Link to="/calendar">
            <FaCalendarAlt className="icon" />
            {isOpen && "Sync Calendar"}
          </Link>
        </li>
        <li className={isActive("/account") ? "active" : ""}>
          <Link to="/account">
            <FaUserCircle className="icon" />
            {isOpen && "Account"}
          </Link>
        </li>
        <li className={isActive("/add-task") ? "active add-task-item" : "add-task-item"}>
          <Link to="/add-task">
            <FaPlusCircle className="icon" />
            {isOpen && "Add New Task"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideNavbar;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaTasks, FaUsers, FaCalendarAlt, FaUserCircle, FaBars, FaPlusCircle, FaBook } from "react-icons/fa";
import "./SideNavbar.css";

const SideNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);  
      } else {
        setIsOpen(true); 
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-backdrop active" onClick={toggleSidebar}></div>
      )}

      <div className={isOpen ? "sidebar open" : "sidebar closed"}>
        <div className="sidebar-header">
          {isOpen && <h2>Tasklist UI</h2>}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li className={isActive("/dashboard") ? "active" : ""}>
            <Link to="/dashboard">
              <FaTachometerAlt className="icon" />
              {isOpen && <span className="link-text">Dashboard</span>}
            </Link>
          </li>
          <li className={isActive("/tasks") ? "active" : ""}>
            <Link to="/tasks">
              <FaTasks className="icon" />
              {isOpen && <span className="link-text">Tasks</span>}
            </Link>
          </li>
          <li className={isActive("/teams") ? "active" : ""}>
            <Link to="/teams">
              <FaUsers className="icon" />
              {isOpen && <span className="link-text">Teams</span>}
            </Link>
          </li>
          <li className={isActive("/calendar") ? "active" : ""}>
            <Link to="/calendar">
              <FaCalendarAlt className="icon" />
              {isOpen && <span className="link-text">Sync Calendar</span>}
            </Link>
          </li>
          <li className={isActive("/account") ? "active" : ""}>
            <Link to="/account">
              <FaUserCircle className="icon" />
              {isOpen && <span className="link-text">Account</span>}
            </Link>
          </li>
          <li className={isActive("/user-manual") ? "active" : ""}>
            <Link to="/user-manual">
              <FaBook className="icon" />
              {isOpen && <span className="link-text">User Manual</span>}
            </Link>
          </li>
          <li className={isActive("/add-task") ? "active add-task-item" : "add-task-item"}>
            <Link to="/add-task">
              <FaPlusCircle className="icon" />
              {isOpen && <span className="link-text">Add New Task</span>}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideNavbar;

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { FaBell } from 'react-icons/fa';
import logo from '../../assets/tasklistlogo.svg';
import './Navbar.css';
import ProfilePic from "../../assets/profile.png";

const NavBar = () => {
  const navigate = useNavigate();

  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownPos, setNotificationDropdownPos] = useState({});
  const [profileDropdownPos, setProfileDropdownPos] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // 🔹 New state for points
  const [points, setPoints] = useState(0);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationDropdownOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target) &&
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(e.target)
      ) {
        setNotificationDropdownOpen(false);
      }

      if (
        profileDropdownOpen &&
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationDropdownOpen, profileDropdownOpen]);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;
      const res = await fetch(`http://localhost:5000/api/notifications?email=${userEmail}`);
      const data = await res.json();
      setNotifications(data);

      const unseenExists = data.some(n => !n.seen_at);
      setHasNewNotification(unseenExists);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // 🔹 Fetch points
  const fetchPoints = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;
      const res = await fetch(`http://localhost:5000/api/user-points?email=${userEmail}`);
      const data = await res.json();
      setPoints(data.points || 0);
    } catch (err) {
      console.error("Error fetching points:", err);
    }
  };

  // 🔹 Poll for new notifications & points
  useEffect(() => {
    fetchNotifications();
    fetchPoints();
    const notifInterval = setInterval(fetchNotifications, 10000);
    const pointsInterval = setInterval(fetchPoints, 30000);
    return () => {
      clearInterval(notifInterval);
      clearInterval(pointsInterval);
    };
  }, []);

  const toggleNotificationDropdown = () => {
    if (notificationRef.current) {
      const rect = notificationRef.current.getBoundingClientRect();
      setNotificationDropdownPos(rect);
      const willOpen = !notificationDropdownOpen;
      setNotificationDropdownOpen(willOpen);
      setProfileDropdownOpen(false);

      if (willOpen) {
        fetchNotifications();
        setHasNewNotification(false);
      }
    }
  };

  const toggleProfileDropdown = () => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setProfileDropdownPos(rect);
      setProfileDropdownOpen(!profileDropdownOpen);
      setNotificationDropdownOpen(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const closeAllDropdowns = () => {
    setNotificationDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    closeAllDropdowns();
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar-login">
        <div className="navbar-login-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <span className="brand-text">Tasklist UI</span>
        </div>

        <div className="navbar-login-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-icon-btn" onClick={handleSearch}>
              🔍
            </button>
          </div>

          <div
            ref={notificationRef}
            className="icon-button"
            onClick={toggleNotificationDropdown}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <FaBell size={20} color="#555" />
            {hasNewNotification && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                }}
              />
            )}
          </div>

          {/* 🔹 Points display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
              margin: "0 12px",
              minWidth: "45px",
              justifyContent: "center"
            }}
          >
            ⭐ {points}
          </div>

          <div
            ref={profileRef}
            className="profile-pic"
            onClick={toggleProfileDropdown}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={ProfilePic}
              alt="Profile"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </nav>

      {profileDropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={profileMenuRef}
            className="dropdown-menu"
            style={{
              position: 'absolute',
              top: profileDropdownPos.bottom + 4,
              left: Math.min(profileDropdownPos.left, window.innerWidth - 180),
              zIndex: 9999,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              padding: '8px 0',
              minWidth: '160px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <button
              className="dropdown-item account"
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '14px',
                color: '#333',
                cursor: 'pointer',
              }}
              onClick={closeAllDropdowns}
            >
              <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
                Account
              </Link>
            </button>
            <button
              className="dropdown-item logout"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '14px',
                color: '#d9534f',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>,
          document.body
        )}

      {notificationDropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={notificationMenuRef}
            className="dropdown-menu"
            style={{
              position: 'absolute',
              top: notificationDropdownPos.bottom + 4,
              left: Math.min(notificationDropdownPos.left, window.innerWidth - 240),
              zIndex: 9999,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              padding: '8px 0',
              minWidth: '220px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#555',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {n.message}
                </div>
              ))
            ) : (
              <>
                <div style={{ padding: '10px 16px', fontSize: '14px', color: '#555', borderBottom: '1px solid #eee' }}>
                  No new notifications
                </div>
                <div style={{ padding: '10px 16px', fontSize: '14px', color: '#888' }}>
                  Check again later
                </div>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default NavBar;


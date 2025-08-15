import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import SideNavbar from "../../components/SideNavbar/SideNavbar";
import ProfilePic from "../../assets/profile.png";
import UpdateProfilePopup from "../../components/UpdateProfilePopup/UpdateProfilePopup";

const Account = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [user, setUser] = useState(userData);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Define the base URL for your backend API using the environment variable
  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleProfileUpdate = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleDeleteAccount = async () => {
    setError("");
    setDeleting(true);
    try {
      // *** IMPORTANT CHANGE HERE ***
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/user/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account deleted successfully.");
        handleLogout();
      } else {
        setError(data.message || "Failed to delete account.");
      }
    } catch (err) {
      setError("Server error while deleting account.");
    }
    setDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="account-layout">
      <SideNavbar />

      <div className="account-page">
        <div className="account-header">
          <h2>My Account</h2>
        </div>

        <div className="account-details">
          <div className="profile-section">
            <img src={ProfilePic} alt="Profile" className="profile-picture" />
            <div className="profile-info">
              <h3>{user.fullName}</h3>
              <p>Email: {user.email}</p>
              <p>Phone: {user.mobile || "N/A"}</p>
            </div>
          </div>

          <div className="account-actions">
            <button className="update-btn" onClick={() => setShowUpdateForm(true)}>
              Update Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>

            <button
              className="delete-account-btn"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>

          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>

        {showUpdateForm && (
          <UpdateProfilePopup
            user={user}
            onClose={() => setShowUpdateForm(false)}
            onUpdate={handleProfileUpdate}
          />
        )}

        {showDeleteConfirm && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Confirm Account Deletion</h3>
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ marginRight: "10px" }}
              >
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;

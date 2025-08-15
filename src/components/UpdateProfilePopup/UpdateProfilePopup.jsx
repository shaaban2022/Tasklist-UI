import { useState } from "react";
import "./UpdateProfilePopup.css";

const UpdateProfilePopup = ({ user, onClose, onUpdate }) => {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [mobile, setMobile] = useState(user.mobile || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define the base URL for your backend API using the environment variable
  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      // *** IMPORTANT CHANGE HERE ***
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          fullName,
          mobile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile");
      } else {
        onUpdate({ fullName, mobile });
        onClose();
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Update Profile</h3>
        <form onSubmit={handleSubmit} className="update-profile-form">
          <label>
            Full Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Mobile Number:
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePopup;

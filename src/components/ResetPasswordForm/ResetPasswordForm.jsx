import { useState } from "react";
import "./ResetPasswordForm.css";

const ResetPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Define the base URL for your backend API using the environment variable
  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // *** IMPORTANT CHANGE HERE ***
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("OTP sent to your email. Please check your inbox.");
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // *** IMPORTANT CHANGE HERE ***
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successfully. You can now login.");
        setStep(1);
        setOtp("");
        setNewPassword("");
      } else {
        setError(data.message || "Invalid OTP or request failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-form-card">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Reset Password
      </h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        {step === 1
          ? "Enter your email to receive an OTP"
          : "Enter OTP and your new password"}
      </p>

      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter your registered email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Send OTP
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter the OTP"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                placeholder="Enter your new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;

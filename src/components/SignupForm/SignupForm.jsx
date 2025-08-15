import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';
import SocialLoginButtons from '../SocialLoginButtons/SocialLoginButtons';

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10,}$/.test(form.mobile)) {
      newErrors.mobile = 'Enter a valid mobile number';
    }

    if (!form.password) newErrors.password = 'Password is required';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length === 0) {
      try {
        const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          localStorage.setItem('isLoggedIn', true);
          navigate('/dashboard');
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Server error. Please try again.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="login-form-card">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Create Account
      </h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Please sign up to continue
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="login-error">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="login-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
            {errors.mobile && <p className="login-error">{errors.mobile}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="login-error">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="login-error">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="remember-me-container">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </div>

        <div className="divider-with-text">
          <span className="divider-text">or</span>
        </div>

        <SocialLoginButtons />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?
            <a
              href="/login"
              className="login-option"
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;


import { useState } from 'react';
import './LoginForm.css';
import SocialLoginButtons from '../SocialLoginButtons/SocialLoginButtons';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
      e.preventDefault();
      setError('');

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userEmail', data.user.email);

          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          setError(data.message || 'Invalid email or password');
        }
      } catch (err) {
        setError('Server error. Please try again.');
      }
    };


  return (
    <div className="login-form-card">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
      <p className="text-sm text-center text-gray-500 mb-6">Please login to your account</p>

      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </div>

        <div className="text-center mt-4" style={{ marginTop: '1rem' }}>
          <p className="text-sm text-gray-600">
            Forgot password?{' '}
            <a href="/resetPassword" className="signup-option">
              Reset Password
            </a>
          </p>
        </div>

        <div className="divider-with-text">
          <span className="divider-text">or</span>
        </div>

        <SocialLoginButtons />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="signup-option">
              Signup
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

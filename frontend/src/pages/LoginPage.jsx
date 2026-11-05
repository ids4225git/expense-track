// =============================================================
// LOGIN PAGE — User Authentication
// =============================================================
// Allows existing users to log in with email and password.
// On success, stores the JWT token and user name in localStorage
// and redirects to the Dashboard.
// =============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { loginUser } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent page refresh
    setError('');
    setLoading(true);

    try {
      // Call the login API
      const data = await loginUser(email, password);

      // Store the token and user name in localStorage
      // localStorage persists even after closing the browser
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      // Show the error message from the API, or a generic one
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="wallet" />
          </span>
          Expense Tracker
        </div>

        <div className="auth-heading">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to manage your expenses</p>
        </div>

        {error && (
          <p className="form-error" role="alert">
            <Icon name="alert" size={16} />
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="text-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="text-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

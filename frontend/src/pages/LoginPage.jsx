// =============================================================
// LOGIN PAGE — User Authentication
// =============================================================
// Allows existing users to log in with email and password.
// On success, stores the JWT token and user name in localStorage
// and redirects to the Dashboard.
// =============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="auth-card">
        <h1>💰 Expense Tracker</h1>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to manage your expenses</p>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
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

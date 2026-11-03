// =============================================================
// NAVBAR COMPONENT — Navigation Bar
// =============================================================
// Shows the app name, navigation links, and a logout button.
// Only shows nav links when the user is logged in.
// =============================================================

import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Check if user is logged in by looking for a token in localStorage
  const isLoggedIn = !!localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  // Handle logout: clear stored data and redirect to login
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">💰 Expense Tracker</Link>
      </div>

      {isLoggedIn && (
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Dashboard</Link>
          <Link to="/add" className="navbar-link">Add Expense</Link>
          <span className="navbar-user">Hi, {userName}!</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

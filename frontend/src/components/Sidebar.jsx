// =============================================================
// SIDEBAR — web navigation (screens 900px and wider)
// =============================================================
// Brand, links to the app's real pages, and the logged-in user
// with a Log out button. NavLink adds the "active" class to the
// link that matches the current URL.
// =============================================================

import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';

function navClass({ isActive }) {
  return isActive ? 'nav-item active' : 'nav-item';
}

function Sidebar({ userName, onLogout }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Icon name="wallet" />
        </span>
        Expense Tracker
      </Link>

      <div className="nav-list">
        {/* "end" means only exactly "/" is active, not every page */}
        <NavLink to="/" end className={navClass}>
          <Icon name="overview" />
          Overview
        </NavLink>
        <NavLink to="/add" className={navClass}>
          <Icon name="plus" />
          Add expense
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-user-label">Signed in as</span>
        <span className="sidebar-user-name">{userName}</span>
        <button type="button" className="link-button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;

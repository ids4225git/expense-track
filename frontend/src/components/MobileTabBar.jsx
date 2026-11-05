// =============================================================
// MOBILE TAB BAR — bottom navigation (screens under 900px)
// =============================================================
// Home · raised "+" (add expense) · Log out.
// Icon-only items get an aria-label so screen readers can name them.
// =============================================================

import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';

function MobileTabBar({ onLogout }) {
  return (
    <nav className="tab-bar" aria-label="Main">
      <NavLink
        to="/"
        end
        aria-label="Home"
        className={({ isActive }) => (isActive ? 'tab-item active' : 'tab-item')}
      >
        <Icon name="home" size={22} />
      </NavLink>

      <Link to="/add" aria-label="Add expense" className="tab-fab">
        <Icon name="plus" size={24} strokeWidth={2.4} />
      </Link>

      <button type="button" aria-label="Log out" className="tab-item" onClick={onLogout}>
        <Icon name="logout" size={22} />
      </button>
    </nav>
  );
}

export default MobileTabBar;

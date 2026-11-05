// =============================================================
// APP LAYOUT — frame for every logged-in page
// =============================================================
// Web: sidebar on the left + main content.
// Mobile: main content + bottom tab bar (only on the home page;
// the add/edit screens have their own Close button instead).
//
// <Outlet /> is where React Router renders the current page.
// =============================================================

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileTabBar from './MobileTabBar';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName');
  const showTabBar = location.pathname === '/';

  // Log out: clear stored data and go to the login page
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  }

  return (
    <div className={showTabBar ? 'app-shell has-tab-bar' : 'app-shell'}>
      <Sidebar userName={userName} onLogout={handleLogout} />
      <main className="app-main">
        <Outlet />
      </main>
      {showTabBar && <MobileTabBar onLogout={handleLogout} />}
    </div>
  );
}

export default AppLayout;

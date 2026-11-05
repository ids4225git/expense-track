// =============================================================
// APP.JSX — Main Application Component
// =============================================================
// This is the root component of the React app. It sets up:
// 1. React Router — handles page navigation
// 2. Route definitions — which component renders for which URL
// 3. AppLayout — sidebar / mobile tab bar around logged-in pages
//
// React Router works by looking at the browser's URL and
// rendering the matching component. No page refresh needed!
// =============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';

// =============================================================
// PROTECTED ROUTE WRAPPER
// =============================================================
// This component checks if the user is logged in before showing
// a page. If not logged in, it redirects to the login page.
//
// Usage: <ProtectedRoute><AppLayout /></ProtectedRoute>
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');

  if (!isLoggedIn) {
    // Redirect to login if there's no token
    return <Navigate to="/login" replace />;
  }

  // User is logged in — show the requested page
  return children;
}

function App() {
  return (
    // BrowserRouter provides the routing context to the entire app
    <BrowserRouter>
      <Routes>
        {/* Public routes — anyone can access (no sidebar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — only logged-in users.
            This parent route has no path: it wraps its child routes
            in the layout, and each child renders inside <Outlet />. */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add" element={<AddExpensePage />} />
          <Route path="/edit/:id" element={<EditExpensePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

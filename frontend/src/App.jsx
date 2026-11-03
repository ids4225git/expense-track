  // =============================================================
// APP.JSX — Main Application Component
// =============================================================
// This is the root component of the React app. It sets up:
// 1. React Router — handles page navigation
// 2. Navbar — shown on every page
// 3. Route definitions — which component renders for which URL
//
// React Router works by looking at the browser's URL and
// rendering the matching component. No page refresh needed!
// =============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
// Usage: <ProtectedRoute><DashboardPage /></ProtectedRoute>
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
      {/* Navbar shows on every page */}
      <Navbar />

      {/* Main content area */}
      <main className="container">
        <Routes>
          {/* Public routes — anyone can access */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — only logged-in users */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddExpensePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditExpensePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

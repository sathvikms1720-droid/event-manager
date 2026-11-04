import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import AddEvent from "./pages/AddEvent";
import Clients from "./pages/Clients";
import Reminders from "./pages/Reminders";
import More from "./pages/More";


// Check whether the saved login token is still valid
const isLoggedIn = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return false;
  }
};


// Protect pages that require login
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  return (
    <Routes>

      {/* Default Route */}
      <Route
        path="/"
        element={
          isLoggedIn()
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-event"
        element={
          <ProtectedRoute>
            <AddEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <More />
          </ProtectedRoute>
        }
      />

      {/* Invalid Route */}
      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn() ? "/dashboard" : "/login"}
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
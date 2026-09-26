import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import AddEvent from "./pages/AddEvent";
import Clients from "./pages/Clients";
import Reminders from "./pages/Reminders";
import More from "./pages/More";

function App() {
  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/add-event" element={<AddEvent />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/more" element={<More />} />

      {/* Invalid Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;
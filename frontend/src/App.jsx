import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StatusPage from "./pages/StatusPage";
import { setAuthToken } from "./api";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) setAuthToken(token);
  }, []);

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/status" element={<StatusPage />} />

        <Route
          path="/dashboard"
          element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
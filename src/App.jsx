// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UserDashboard from "./pages/UserDashBoard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CodingAssessment from "./pages/CodingAssessment.jsx";
import AptitudeAssessment from "./pages/AptitudeAssessment.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/coding-assessment" element={<CodingAssessment />} />
        <Route path="/aptitude-assessment" element={<AptitudeAssessment />} />
      </Routes>
    </Router>
  );
}

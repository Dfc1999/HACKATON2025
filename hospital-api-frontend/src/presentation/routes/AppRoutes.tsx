import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.tsx";
import DoctorDashboard from "../pages/DoctorDashboard.tsx";
import AdminDashboard from "../pages/AdminDashboard.tsx";
import PatientRegistration from "../pages/PatientRegistration.tsx";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/patient/register" element={<PatientRegistration />} />
      {/* Fallback: redirige al login si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
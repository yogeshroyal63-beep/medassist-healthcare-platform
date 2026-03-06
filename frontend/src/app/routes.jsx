import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login.jsx";
import Signup from "../features/auth/pages/Signup.jsx";
import RoleSelection from "../features/auth/pages/RoleSelection.jsx";

import PatientDashboard from "../features/patient/pages/PatientDashboard.jsx";
import DoctorDashboard from "../features/doctors/pages/DoctorDashboard.jsx";
import AdminDashboard from "../features/admin/pages/AdminDashboard.jsx";

import ProtectedRoute from "../shared/components/ProtectedRoute.jsx";
import RoleGuard from "../shared/components/RoleGuard.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/role" element={<RoleSelection />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard role="PATIENT">
              <PatientDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard role="DOCTOR">
              <DoctorDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard role="ADMIN">
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
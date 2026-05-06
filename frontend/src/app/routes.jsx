import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import RoleSelection from "../features/auth/pages/RoleSelection";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import PatientPortal from "../features/patient/pages/PatientPortal";
import DoctorPortal from "../features/doctors/pages/DoctorPortal";
import AdminPortal from "../features/admin/pages/AdminPortal";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import RoleGuard from "../shared/components/RoleGuard";
import AppShell from "../shared/components/AppShell";
import { useAuth } from "../shared/hooks/useAuth";

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/dashboard" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <HomeRedirect /> : <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
      <Route path="/role" element={<PublicOnlyRoute><RoleSelection /></PublicOnlyRoute>} />
      <Route path="/role-selection" element={<PublicOnlyRoute><RoleSelection /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/patient/dashboard" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/symptom-check" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/find-doctor" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/appointments" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/messages" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/video-consultation" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/medications" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/records" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />
        <Route path="/patient/settings" element={<RoleGuard role="PATIENT"><PatientPortal /></RoleGuard>} />

        <Route path="/doctor/dashboard" element={<RoleGuard role="DOCTOR"><DoctorPortal /></RoleGuard>} />
        <Route path="/doctor/appointments" element={<RoleGuard role="DOCTOR"><DoctorPortal /></RoleGuard>} />
        <Route path="/doctor/patients" element={<RoleGuard role="DOCTOR"><DoctorPortal /></RoleGuard>} />
        <Route path="/doctor/schedule" element={<RoleGuard role="DOCTOR"><DoctorPortal /></RoleGuard>} />
        <Route path="/doctor/messages" element={<RoleGuard role="DOCTOR"><DoctorPortal /></RoleGuard>} />
        <Route path="/doctor/video-consultation" element={<RoleGuard role="DOCTOR"><DoctorPortal /></RoleGuard>} />

        <Route path="/admin/dashboard" element={<RoleGuard role="ADMIN"><AdminPortal /></RoleGuard>} />
        <Route path="/admin/doctor-approvals" element={<RoleGuard role="ADMIN"><AdminPortal /></RoleGuard>} />
        <Route path="/admin/users" element={<RoleGuard role="ADMIN"><AdminPortal /></RoleGuard>} />
        <Route path="/admin/audit-logs" element={<RoleGuard role="ADMIN"><AdminPortal /></RoleGuard>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

import { Routes, Route } from "react-router-dom";
import Landing from "../features/public/pages/Landing.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Signup from "../features/auth/pages/Signup.jsx";
import RoleSelection from "../features/auth/pages/RoleSelection.jsx";
import PatientPortal from "../features/patient/pages/PatientPortal.jsx";
import DoctorPortal from "../features/doctors/pages/DoctorPortal.jsx";
import AdminPortal from "../features/admin/pages/AdminPortal.jsx";

import ProtectedRoute from "../shared/components/ProtectedRoute.jsx";
import RoleGuard from "../shared/components/RoleGuard.jsx";
import AppShell from "../shared/components/AppShell.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/role" element={<RoleSelection />} />
      <Route path="/role-selection" element={<RoleSelection />} />
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
    </Routes>
  );
};

export default AppRoutes;
import { Navigate } from "react-router-dom";

const RoleGuard = ({ children, role }) => {

  const storedRole = localStorage.getItem("role");

  if (storedRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleGuard;
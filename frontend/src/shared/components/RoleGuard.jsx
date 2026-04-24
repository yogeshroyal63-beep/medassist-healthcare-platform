import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleGuard = ({ children, role }) => {
  const { user } = useAuth();
  const storedRole = user?.role;

  if (storedRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleGuard;
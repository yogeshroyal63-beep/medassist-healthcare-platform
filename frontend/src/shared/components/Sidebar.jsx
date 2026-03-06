import { Link } from "react-router-dom";

const Sidebar = () => {

  const role = localStorage.getItem("role");

  return (
    <aside className="sidebar">

      {role === "PATIENT" && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/triage">Smart Check</Link>
          <Link to="/appointments">Appointments</Link>
        </>
      )}

      {role === "DOCTOR" && (
        <>
          <Link to="/doctor/dashboard">Dashboard</Link>
        </>
      )}

      {role === "ADMIN" && (
        <>
          <Link to="/admin/dashboard">Admin</Link>
        </>
      )}

    </aside>
  );

};

export default Sidebar;
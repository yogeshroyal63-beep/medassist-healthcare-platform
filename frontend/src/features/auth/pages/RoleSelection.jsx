import { useNavigate } from "react-router-dom";

const RoleSelection = () => {

  const navigate = useNavigate();

  return (
    <div>

      <h2>Select Role</h2>

      <button onClick={() => navigate("/signup?role=patient")}>
        Patient
      </button>

      <button onClick={() => navigate("/signup?role=doctor")}>
        Doctor
      </button>

    </div>
  );
};

export default RoleSelection;
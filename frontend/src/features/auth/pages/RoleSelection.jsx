import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Stethoscope } from "lucide-react";

export default function RoleSelection() {

  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {

    if (!selectedRole) return;

    if (selectedRole === "patient") {
      navigate("/patient/dashboard");
    }

    if (selectedRole === "doctor") {
      navigate("/doctor-verification");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-500 text-white p-2 rounded-xl">
          ❤
        </div>
        <h1 className="text-xl font-semibold text-blue-600">MedAssist</h1>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-2">
        Choose Your Account Type
      </h2>

      <p className="text-gray-500 mb-8">
        Select the role that best describes how you'll use MedAssist
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

        {/* Patient Card */}
        <div
          onClick={() => setSelectedRole("patient")}
          className={`border rounded-xl p-6 cursor-pointer transition
          ${
            selectedRole === "patient"
              ? "border-blue-500 shadow-lg"
              : "border-gray-200 hover:shadow"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold">Patient</h3>
          </div>

          <p className="text-gray-500 mb-4">
            For individuals seeking healthcare management
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Check symptoms with Smart Check</li>
            <li>✓ Identify medicines by image or name</li>
            <li>✓ Manage medications and reminders</li>
            <li>✓ Book and manage appointments</li>
            <li>✓ Maintain digital health records</li>
            <li>✓ Access medical history timeline</li>
          </ul>

          <div className="bg-blue-100 text-blue-600 text-xs mt-4 p-2 rounded">
            ✓ Instant access to all features
          </div>
        </div>

        {/* Doctor Card */}
        <div
          onClick={() => setSelectedRole("doctor")}
          className={`border rounded-xl p-6 cursor-pointer transition
          ${
            selectedRole === "doctor"
              ? "border-green-500 shadow-lg"
              : "border-gray-200 hover:shadow"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Stethoscope className="text-green-600" />
            </div>

            <h3 className="text-lg font-semibold">Doctor</h3>
          </div>

          <p className="text-gray-500 mb-4">
            For healthcare professionals and practitioners
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Manage patient appointments</li>
            <li>✓ Review patient symptoms</li>
            <li>✓ Create consultation notes</li>
            <li>✓ Write digital prescriptions</li>
            <li>✓ Access patient medical history</li>
            <li>✓ Professional verification badge</li>
          </ul>

          <div className="bg-orange-100 text-orange-600 text-xs mt-4 p-2 rounded">
            ⚠ Requires verification of medical license
          </div>
        </div>

      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className="mt-8 px-8 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Continue
      </button>

      <p className="text-xs text-gray-400 mt-3">
        You can always update your account settings later
      </p>

    </div>
  );
}
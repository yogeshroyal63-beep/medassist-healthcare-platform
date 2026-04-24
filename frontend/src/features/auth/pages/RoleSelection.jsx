import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Stethoscope } from "lucide-react";

export default function RoleSelection() {

  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {

    if (!selectedRole) return;

    if (selectedRole === "patient") {
      navigate("/signup", { state: { role: "PATIENT" } });
    }

    if (selectedRole === "doctor") {
      navigate("/signup", { state: { role: "DOCTOR" } });
    }
  };

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-3xl text-[var(--brand-700)]">Choose your access role</h1>
        <p className="mt-2 text-center text-slate-600">Dedicated experience for patients and medical professionals.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div
          onClick={() => setSelectedRole("patient")}
          className={`glass-card cursor-pointer rounded-3xl p-7 transition
          ${
            selectedRole === "patient"
              ? "ring-2 ring-cyan-500"
              : "hover:-translate-y-1 hover:shadow-xl"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-cyan-100 p-3">
              <User className="text-blue-600" />
            </div>
            <h3 className="text-xl">Patient</h3>
          </div>
          <p className="mb-4 text-slate-600">For individuals managing health, consultations, and medication plans.</p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>✓ Check symptoms with Smart Check</li>
            <li>✓ Manage medications and reminders</li>
            <li>✓ Book and manage appointments</li>
            <li>✓ Maintain digital health records</li>
          </ul>
          <div className="mt-4 rounded-lg bg-cyan-100 p-2 text-xs text-cyan-700">
            ✓ Instant access to all features
          </div>
        </div>
        <div
          onClick={() => setSelectedRole("doctor")}
          className={`glass-card cursor-pointer rounded-3xl p-7 transition
          ${
            selectedRole === "doctor"
              ? "ring-2 ring-emerald-500"
              : "hover:-translate-y-1 hover:shadow-xl"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-100 p-3">
              <Stethoscope className="text-green-600" />
            </div>
            <h3 className="text-xl">Doctor</h3>
          </div>
          <p className="mb-4 text-slate-600">For healthcare professionals managing patient care workflows.</p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>✓ Manage patient appointments</li>
            <li>✓ Review patient symptoms</li>
            <li>✓ Create consultation notes</li>
            <li>✓ Write digital prescriptions</li>
          </ul>
          <div className="mt-4 rounded-lg bg-amber-100 p-2 text-xs text-amber-700">
            ⚠ Requires verification of medical license
          </div>
        </div>
      </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="rounded-xl bg-[var(--brand-700)] px-10 py-3 font-semibold text-white transition hover:bg-[var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
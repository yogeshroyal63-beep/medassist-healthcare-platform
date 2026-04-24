import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu, X } from "lucide-react";

const linksByRole = {
  PATIENT: [
    ["/patient/dashboard", "Dashboard"],
    ["/patient/symptom-check", "Symptom Check"],
    ["/patient/find-doctor", "Find Doctor"],
    ["/patient/appointments", "Appointments"],
    ["/patient/messages", "Messages"]
  ],
  DOCTOR: [
    ["/doctor/dashboard", "Dashboard"],
    ["/doctor/appointments", "Appointments"],
    ["/doctor/patients", "Patients"],
    ["/doctor/schedule", "Schedule"],
    ["/doctor/messages", "Messages"]
  ],
  ADMIN: [
    ["/admin/dashboard", "Dashboard"],
    ["/admin/doctor-approvals", "Doctor Approvals"],
    ["/admin/users", "User Management"],
    ["/admin/audit-logs", "Audit Logs"]
  ]
};

const AppShell = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const links = linksByRole[user?.role] || [];
  const [open, setOpen] = useState(false);
  const role = user?.role || "USER";

  const linkClasses = (to) =>
    `rounded-xl px-3 py-2 transition ${
      location.pathname === to
        ? "bg-cyan-500/25 text-cyan-200"
        : "text-slate-200 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-slate-900 p-2 text-white shadow-lg md:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--brand-950)] p-5 text-slate-100 transition-transform md:static md:w-auto md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <h1 className="text-xl font-semibold text-cyan-300">MedAssist</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{role} Workspace</p>
          <nav className="mt-6 grid gap-2 text-sm">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className={linkClasses(to)} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-6 w-full rounded-xl bg-rose-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
          >
            Logout
          </button>
        </aside>
        <main className="p-4 pt-16 md:p-8 md:pt-8">
          <div className="glass-card mb-6 flex items-center justify-between rounded-2xl px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Care Intelligence</p>
              <h2 className="text-xl text-slate-900">Welcome, {user?.fullName || "User"}</h2>
            </div>
            <div className="rounded-full bg-cyan-100 px-4 py-2 text-xs font-semibold text-cyan-800">
              Secure Session
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;

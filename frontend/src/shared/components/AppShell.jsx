import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

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
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const links = linksByRole[user?.role] || [];
  const [open, setOpen] = useState(false);
  const role = user?.role || "USER";

  const linkClasses = (to) =>
    `rounded-xl px-3 py-2 transition-colors ${
      location.pathname === to
        ? "bg-white/10 text-white"
        : "text-slate-200 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen">
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-[var(--brand-950)]/95 p-2 text-white shadow-lg md:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--brand-950)]/95 p-5 text-slate-100 backdrop-blur transition-transform md:static md:w-auto md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <span className="text-lg font-semibold text-white">M</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">MedAssist</h1>
              <p className="mt-0.5 text-xs uppercase tracking-[0.25em] text-slate-400">{role} Workspace</p>
            </div>
          </div>
          <nav className="mt-6 grid gap-2 text-sm">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className={linkClasses(to)} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-6 w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/15"
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
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white"
              >
                {theme === "dark" ? "Dark" : "Light"}
              </button>
              <div className="rounded-full bg-cyan-100 px-4 py-2 text-xs font-semibold text-cyan-800">
                Secure Session
              </div>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;

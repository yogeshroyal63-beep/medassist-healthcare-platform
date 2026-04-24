import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";

const LOGS_PER_PAGE = 8;

const AdminPortal = () => {
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyDoctorId, setBusyDoctorId] = useState("");
  const [error, setError] = useState("");
  const [pendingQuery, setPendingQuery] = useState(localStorage.getItem("adminPendingQuery") || "");
  const [logPage, setLogPage] = useState(1);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, p, l] = await Promise.all([api.get("/admin/stats"), api.get("/admin/doctors/pending"), api.get("/admin/audit-logs")]);
      setStats(s.data);
      setPending(p.data);
      setLogs(l.data);
    } catch {
      setError("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (profileId) => {
    setBusyDoctorId(profileId);
    const previousPending = [...pending];
    setPending((prev) => prev.filter((d) => d._id !== profileId));
    try {
      await api.put(`/admin/doctors/${profileId}/approve`);
      toast.success("Doctor approved successfully");
    } catch {
      setPending(previousPending);
      toast.error("Unable to approve doctor");
    } finally {
      setBusyDoctorId("");
    }
  };

  const rejectDoctor = async (profileId) => {
    const note = window.prompt("Add rejection note (optional):", "");
    setBusyDoctorId(profileId);
    const previousPending = [...pending];
    setPending((prev) => prev.filter((d) => d._id !== profileId));
    try {
      await api.put(`/admin/doctors/${profileId}/reject`, { note: note || "" });
      toast.success("Doctor rejected");
    } catch {
      setPending(previousPending);
      toast.error("Unable to reject doctor");
    } finally {
      setBusyDoctorId("");
    }
  };

  useEffect(() => {
    load().catch(() => null);
  }, []);

  useEffect(() => {
    localStorage.setItem("adminPendingQuery", pendingQuery);
  }, [pendingQuery]);

  const filteredPending = pending.filter((d) => {
    const q = pendingQuery.toLowerCase();
    const name = (d.user?.fullName || "").toLowerCase();
    const specialty = (d.specialty || "").toLowerCase();
    return name.includes(q) || specialty.includes(q);
  });

  const totalLogPages = Math.max(1, Math.ceil(logs.length / LOGS_PER_PAGE));
  const pagedLogs = logs.slice((logPage - 1) * LOGS_PER_PAGE, logPage * LOGS_PER_PAGE);

  useEffect(() => {
    if (logPage > totalLogPages) setLogPage(totalLogPages);
  }, [logPage, totalLogPages]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />)}
        </section>
        <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button onClick={load} className="ml-3 font-semibold underline">Retry</button>
        </div>
      )}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-xl p-4">Users: {stats.totalUsers || 0}</div>
        <div className="glass-card rounded-xl p-4">Doctors: {stats.totalDoctors || 0}</div>
        <div className="glass-card rounded-xl p-4">Appointments: {stats.totalAppointments || 0}</div>
      </section>
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg">Doctor Approvals</h3>
        <input
          value={pendingQuery}
          onChange={(e) => setPendingQuery(e.target.value)}
          placeholder="Search pending doctors"
          className="input-ui mt-3"
        />
        <div className="mt-3 space-y-2">
          {filteredPending.map((d) => (
            <div key={d._id} className="rounded-lg border border-black/10 bg-white/50 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{d.user?.fullName}</p>
                  <p className="text-slate-600">{d.specialty}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveDoctor(d._id)}
                    disabled={busyDoctorId === d._id}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectDoctor(d._id)}
                    disabled={busyDoctorId === d._id}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!filteredPending.length && <p className="text-sm text-slate-500">No pending approvals.</p>}
        </div>
      </section>
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg">Audit Logs</h3>
        <div className="mt-3 space-y-2">
          {pagedLogs.map((l) => (
            <div key={l._id} className="rounded-lg border border-black/10 bg-white/50 p-3 text-sm">{l.action} - {l.target}</div>
          ))}
          {!logs.length && <p className="text-sm text-slate-500">No audit events available.</p>}
        </div>
        {logs.length > LOGS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-end gap-2 text-xs">
            <button onClick={() => setLogPage((p) => Math.max(1, p - 1))} className="rounded-md border px-2 py-1">Prev</button>
            <span>{logPage} / {totalLogPages}</span>
            <button onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))} className="rounded-md border px-2 py-1">Next</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPortal;

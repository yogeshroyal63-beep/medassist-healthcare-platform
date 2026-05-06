import { useEffect, useState } from "react";
import api from "../../../shared/utils/api";
import { useAuth } from "../../../shared/hooks/useAuth";
import toast from "react-hot-toast";

const APPOINTMENTS_PER_PAGE = 6;

const DoctorPortal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyAppointmentId, setBusyAppointmentId] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(localStorage.getItem("doctorStatusFilter") || "ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        api.get("/doctors/dashboard/stats"),
        api.get(`/appointments/doctor/${user.id}`)
      ]);
      setStats(statsRes.data);
      setAppointments(appointmentsRes.data);
    } catch {
      setError("Unable to load doctor dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    setBusyAppointmentId(appointmentId);
    const previousAppointments = [...appointments];
    setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? { ...a, status } : a)));
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status });
      toast.success(`Appointment ${status.toLowerCase()}`);
      await load();
    } catch {
      setAppointments(previousAppointments);
      toast.error("Unable to update appointment status");
    } finally {
      setBusyAppointmentId("");
    }
  };

  useEffect(() => {
    load().catch(() => null);
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem("doctorStatusFilter", statusFilter);
    setCurrentPage(1);
  }, [statusFilter]);

  const filteredAppointments = appointments.filter((a) =>
    statusFilter === "ALL" ? true : a.status === statusFilter
  );
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE));
  const pagedAppointments = filteredAppointments.slice(
    (currentPage - 1) * APPOINTMENTS_PER_PAGE,
    currentPage * APPOINTMENTS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />)}
        </section>
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
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
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Today's Patients", stats?.todayPatients ?? 0],
          ["Total Appointments", stats?.totalAppointments ?? 0],
          ["Pending", stats?.pending ?? 0],
          ["Revenue", `₹${stats?.revenue ?? 0}`]
        ].map(([label, value]) => (
          <div key={label} className="glass-card rounded-xl p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg">Appointment Management</h3>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-black/10 bg-white/50 px-2 py-1"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="mt-3 space-y-2">
          {pagedAppointments.map((a) => (
            <div key={a._id} className="rounded-lg border border-black/10 bg-white/50 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span>{a.patient?.fullName} - {a.date} {a.time}</span>
                <span className="rounded-full bg-black/5 px-3 py-1">{a.status}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateStatus(a._id, "CONFIRMED")}
                  disabled={busyAppointmentId === a._id}
                  className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(a._id, "COMPLETED")}
                  disabled={busyAppointmentId === a._id}
                  className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Complete
                </button>
                <button
                  onClick={() => updateStatus(a._id, "CANCELLED")}
                  disabled={busyAppointmentId === a._id}
                  className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
          {!filteredAppointments.length && <p className="text-sm text-slate-500">No appointments found.</p>}
        </div>
        {filteredAppointments.length > APPOINTMENTS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-end gap-2 text-xs">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded-md border px-2 py-1">Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="rounded-md border px-2 py-1">Next</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DoctorPortal;

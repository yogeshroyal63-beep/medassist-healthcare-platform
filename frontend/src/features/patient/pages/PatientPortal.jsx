import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";
import { useAuth } from "../../../shared/hooks/useAuth";

const DOCTORS_PER_PAGE = 4;
const APPOINTMENTS_PER_PAGE = 5;

const PatientPortal = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [triageResult, setTriageResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingDoctorId, setBookingDoctorId] = useState("");
  const [doctorQuery, setDoctorQuery] = useState(localStorage.getItem("patientDoctorQuery") || "");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState(localStorage.getItem("patientAppointmentStatusFilter") || "ALL");
  const [doctorPage, setDoctorPage] = useState(1);
  const [appointmentPage, setAppointmentPage] = useState(1);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        api.get("/doctors"),
        api.get(`/appointments/patient/${user.id}`)
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
    } catch {
      setError("Failed to load patient dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => null);
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem("patientDoctorQuery", doctorQuery);
  }, [doctorQuery]);

  useEffect(() => {
    localStorage.setItem("patientAppointmentStatusFilter", appointmentStatusFilter);
  }, [appointmentStatusFilter]);

  const runTriage = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter symptoms first");
      return;
    }
    try {
      const payload = { symptoms: symptoms.split(",").map((s) => s.trim()).filter(Boolean) };
      if (age) payload.age = Number(age);
      const { data } = await api.post("/triage/check", payload);
      setTriageResult(data);
      toast.success("Triage completed");
    } catch {
      toast.error("Unable to run symptom check");
    }
  };

  const bookAppointment = async (doctorId) => {
    setBookingDoctorId(doctorId);
    const optimisticId = `temp-${Date.now()}`;
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const optimistic = {
      _id: optimisticId,
      date,
      time: "10:30",
      status: "PENDING"
    };
    setAppointments((prev) => [optimistic, ...prev]);
    try {
      await api.post("/appointments/book", {
        doctor: doctorId,
        date,
        time: "10:30",
        type: "VIDEO",
        notes: "Booked from patient dashboard quick action"
      });
      toast.success("Appointment request sent");
      await load();
    } catch {
      setAppointments((prev) => prev.filter((a) => a._id !== optimisticId));
      toast.error("Unable to book appointment");
    } finally {
      setBookingDoctorId("");
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    const name = (d.user?.fullName || "").toLowerCase();
    const specialty = (d.specialty || "").toLowerCase();
    const query = doctorQuery.toLowerCase();
    return name.includes(query) || specialty.includes(query);
  });

  const filteredAppointments = appointments.filter((a) =>
    appointmentStatusFilter === "ALL" ? true : a.status === appointmentStatusFilter
  );

  const totalDoctorPages = Math.max(1, Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE));
  const totalAppointmentPages = Math.max(1, Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE));
  const doctorsPageSlice = filteredDoctors.slice((doctorPage - 1) * DOCTORS_PER_PAGE, doctorPage * DOCTORS_PER_PAGE);
  const appointmentsPageSlice = filteredAppointments.slice((appointmentPage - 1) * APPOINTMENTS_PER_PAGE, appointmentPage * APPOINTMENTS_PER_PAGE);

  useEffect(() => {
    setDoctorPage(1);
  }, [doctorQuery]);

  useEffect(() => {
    setAppointmentPage(1);
  }, [appointmentStatusFilter]);

  useEffect(() => {
    if (doctorPage > totalDoctorPages) setDoctorPage(totalDoctorPages);
  }, [doctorPage, totalDoctorPages]);

  useEffect(() => {
    if (appointmentPage > totalAppointmentPages) setAppointmentPage(totalAppointmentPages);
  }, [appointmentPage, totalAppointmentPages]);

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-200" />)}
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
      <section className="glass-card rounded-2xl p-6">
        <h2 className="text-xl text-slate-800">Smart Symptom Check</h2>
        <p className="mt-1 text-sm text-slate-500">Decision-support only. This tool does not provide diagnosis.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_140px_120px]">
          <input value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="fever, cough, headache" className="input-ui" />
          <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className="input-ui" />
          <button onClick={runTriage} className="rounded-xl bg-[var(--brand-700)] px-5 text-white transition hover:bg-[var(--brand-900)]">Analyze</button>
        </div>
        {triageResult && (
          <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm text-slate-700">
            {triageResult.degraded && (
              <p className="mb-2 rounded-md bg-amber-100 px-2 py-1 text-amber-900">
                AI engine fallback mode is active. Use clinical judgment for urgent symptoms.
              </p>
            )}
            <p><span className="font-semibold">Severity:</span> {triageResult.severity}</p>
            <p className="mt-1"><span className="font-semibold">Recommended Action:</span> {triageResult.recommendation}</p>
            <ul className="mt-2 list-disc pl-5">
              {(triageResult.insights || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}
      </section>

      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg text-slate-800">Find Doctor</h3>
        <input
          value={doctorQuery}
          onChange={(e) => setDoctorQuery(e.target.value)}
          placeholder="Search doctor by name or specialty"
          className="input-ui mt-3"
        />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {doctorsPageSlice.map((d) => (
            <div key={d._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-900">{d.user?.fullName}</p>
              <p className="text-sm text-slate-600">{d.specialty}</p>
              <p className="mt-1 text-xs text-slate-500">{d.location || "Location unavailable"}</p>
              <button
                onClick={() => bookAppointment(d.user?._id)}
                disabled={bookingDoctorId === d.user?._id}
                className="mt-3 rounded-lg bg-[var(--brand-700)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Book Appointment
              </button>
            </div>
          ))}
          {!filteredDoctors.length && <p className="text-sm text-slate-500">No doctors matched current filters.</p>}
        </div>
        {filteredDoctors.length > DOCTORS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-end gap-2 text-xs">
            <button onClick={() => setDoctorPage((p) => Math.max(1, p - 1))} className="rounded-md border px-2 py-1">Prev</button>
            <span>{doctorPage} / {totalDoctorPages}</span>
            <button onClick={() => setDoctorPage((p) => Math.min(totalDoctorPages, p + 1))} className="rounded-md border px-2 py-1">Next</button>
          </div>
        )}
      </section>

      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg text-slate-800">Appointment History</h3>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <label>Status:</label>
          <select
            value={appointmentStatusFilter}
            onChange={(e) => setAppointmentStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="mt-3 space-y-2">
          {appointmentsPageSlice.map((a) => (
            <div key={a._id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <span>{a.date} {a.time}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{a.status}</span>
            </div>
          ))}
          {!filteredAppointments.length && <p className="text-sm text-slate-500">No appointments yet.</p>}
        </div>
        {filteredAppointments.length > APPOINTMENTS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-end gap-2 text-xs">
            <button onClick={() => setAppointmentPage((p) => Math.max(1, p - 1))} className="rounded-md border px-2 py-1">Prev</button>
            <span>{appointmentPage} / {totalAppointmentPages}</span>
            <button onClick={() => setAppointmentPage((p) => Math.min(totalAppointmentPages, p + 1))} className="rounded-md border px-2 py-1">Next</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PatientPortal;

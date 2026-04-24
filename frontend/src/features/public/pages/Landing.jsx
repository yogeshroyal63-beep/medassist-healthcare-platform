import { Link } from "react-router-dom";

const Landing = () => (
  <div className="min-h-screen bg-[var(--brand-950)] text-slate-100">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <h1 className="text-2xl font-semibold tracking-tight text-cyan-300">MedAssist</h1>
      <div className="flex gap-3 text-sm">
        <Link to="/login" className="rounded-full border border-cyan-700 px-5 py-2 hover:bg-cyan-900/30">Sign in</Link>
        <Link to="/role-selection" className="rounded-full bg-cyan-400 px-5 py-2 font-semibold text-slate-900 hover:bg-cyan-300">Get started</Link>
      </div>
    </header>
    <main className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-2">
      <section className="space-y-6">
        <p className="inline-flex rounded-full border border-cyan-700/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
          AI-Powered Healthcare Management
        </p>
        <h2 className="text-4xl leading-tight md:text-5xl">Clinical-grade digital care for patients, doctors, and hospitals.</h2>
        <p className="max-w-xl text-slate-300">
          MedAssist unifies triage intelligence, consultation workflows, appointment management, records, and communication into one secure enterprise platform.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/role-selection" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-900 hover:bg-cyan-300">Launch Workspace</Link>
          <Link to="/login" className="rounded-xl border border-slate-500 px-5 py-3 hover:bg-slate-800">Access Existing Account</Link>
        </div>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
        <h3 className="text-2xl">Why teams choose MedAssist</h3>
        <div className="mt-5 grid gap-4">
          {[
            "Role-based secure workflows with audit tracking",
            "AI symptom check with emergency safety overrides",
            "Appointments, reminders, health records in one view",
            "Real-time messaging and video consultations"
          ].map((point) => (
            <div key={point} className="rounded-2xl border border-slate-600/30 bg-slate-900/40 px-4 py-3 text-sm text-slate-200">
              {point}
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default Landing;

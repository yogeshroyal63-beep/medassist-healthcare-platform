import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email"); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent — check your inbox");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl" style={{ color: "var(--brand-700)" }}>MedAssist</p>
          <p className="mt-1 text-sm text-slate-600">Password recovery</p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          {sent ? (
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--brand-50)" }}
              >
                <svg className="h-8 w-8" style={{ color: "var(--brand-700)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Check your email</h2>
              <p className="mt-2 text-sm text-slate-500">
                We sent a password reset link to <span className="font-medium text-slate-700">{email}</span>.
                It expires in 1 hour.
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--brand-700)" }}
                >
                  Try again
                </button>
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-xl py-3 font-semibold text-white transition"
                style={{ background: "var(--brand-700)" }}
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl text-slate-900">Forgot password?</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your email and we&apos;ll send you a secure reset link.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Email address</label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className={`input-ui ${error ? "border-red-500" : ""}`}
                    autoFocus
                  />
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 font-semibold text-white transition disabled:opacity-50"
                  style={{ background: "var(--brand-700)" }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-slate-600">
                Remember your password?{" "}
                <button
                  className="font-semibold hover:underline"
                  style={{ color: "var(--brand-700)" }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

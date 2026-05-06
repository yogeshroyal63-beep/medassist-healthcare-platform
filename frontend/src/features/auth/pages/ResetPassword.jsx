import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const getStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const strength = getStrength(password);

  const validate = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Must be at least 8 characters";
    if (!confirm) errs.confirm = "Please confirm your password";
    else if (password !== confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      toast.success("Password updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed — link may have expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl" style={{ color: "var(--brand-700)" }}>MedAssist</p>
          <p className="mt-1 text-sm text-slate-600">Set your new password</p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          {done ? (
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--brand-50)" }}
              >
                <svg className="h-8 w-8" style={{ color: "var(--brand-700)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Password updated!</h2>
              <p className="mt-2 text-sm text-slate-500">
                Your password has been changed. You can now sign in with your new credentials.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-xl py-3 font-semibold text-white transition"
                style={{ background: "var(--brand-700)" }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl text-slate-900">Create new password</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a strong password with at least 8 characters.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">New password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
                      className={`input-ui pr-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors"
                            style={{ background: i <= strength ? strengthColor[strength] : "#e2e8f0" }}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs" style={{ color: strengthColor[strength] }}>
                        {strengthLabel[strength]}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Confirm new password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setErrors(prev => ({ ...prev, confirm: "" })); }}
                      className={`input-ui pr-10 ${errors.confirm ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirm && <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
                  {confirm && password === confirm && (
                    <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3 font-semibold text-white transition disabled:opacity-50"
                  style={{ background: "var(--brand-700)" }}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

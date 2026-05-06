import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.user, data.accessToken || data.token);
      toast.success("Welcome back");

      const role = (data.user?.role || "").toUpperCase();
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl text-brand-700">MedAssist</p>
          <p className="mt-1 text-sm text-slate-600">
            Secure healthcare workspace access
          </p>
        </div>
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-2xl text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to continue to your care dashboard.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-ui ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-ui ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--brand-700)" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold text-white transition disabled:opacity-50"
              style={{ background: "var(--brand-700)" }}
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button
              className="font-semibold hover:underline"
              style={{ color: "var(--brand-700)" }}
              onClick={() => navigate("/role-selection")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

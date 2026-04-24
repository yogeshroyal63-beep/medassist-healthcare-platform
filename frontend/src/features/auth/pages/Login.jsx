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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      toast.success("Welcome back");
      if (data.user.role === "ADMIN") navigate("/admin/dashboard");
      if (data.user.role === "DOCTOR") navigate("/doctor/dashboard");
      if (data.user.role === "PATIENT") navigate("/patient/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="text-3xl text-[var(--brand-700)]">MedAssist</p>
          <p className="mt-1 text-sm text-slate-600">Secure healthcare workspace access</p>
        </div>
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-2xl text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue to your care dashboard.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-ui" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-ui" />
            </div>
            <button className="w-full rounded-xl bg-[var(--brand-700)] py-3 font-semibold text-white transition hover:bg-[var(--brand-900)]">
              Sign In
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button className="font-semibold text-[var(--brand-700)] hover:underline" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
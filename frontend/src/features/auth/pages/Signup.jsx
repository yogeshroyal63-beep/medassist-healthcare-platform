import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import api from "../../../shared/utils/api";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = location.state?.role || "PATIENT";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: defaultRole,
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    try {
      await api.post("/auth/register", {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: form.password
      });
      toast.success("Registration submitted. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 text-center">
          <h1 className="text-3xl text-[var(--brand-700)]">Create your MedAssist account</h1>
          <p className="text-sm text-slate-600">Profile setup takes under 2 minutes.</p>
        </div>
        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input-ui" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="john.doe@example.com" className="input-ui" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 90000 00000" className="input-ui" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Account Type</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-ui">
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Create password" className="input-ui pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-slate-500">
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="input-ui pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-slate-500">
                {showConfirmPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
            <div className="md:col-span-2">
              <button className="w-full rounded-xl bg-[var(--brand-700)] py-3 font-semibold text-white transition hover:bg-[var(--brand-900)]">
                Create account
              </button>
            </div>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button className="font-semibold text-[var(--brand-700)] hover:underline" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </p>
          {form.role === "DOCTOR" && (
            <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-800">
              Doctor accounts require admin approval before first login.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@medassist.com") {
      login({ role: "ADMIN" });
      navigate("/admin/dashboard");
    } else if (email === "doctor@test.com") {
      login({ role: "DOCTOR" });
      navigate("/doctor/dashboard");
    } else {
      login({ role: "PATIENT" });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fb] font-sans">

      {/* Logo */}

      {/* Logo */}

{/* Logo */}

      <div className="flex items-center gap-3 mb-8">

        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center relative">

          {/* horizontal line */}
          <div className="absolute w-6 h-[3px] bg-white rounded"></div>

          {/* vertical line */}
          <div className="absolute h-6 w-[3px] bg-white rounded"></div>

        </div>

        <span className="text-3xl font-bold text-blue-500">
          MedAssist
        </span>

      </div>
      {/* Login Card */}

      <div className="bg-white w-[380px] p-8 rounded-xl shadow-lg">

        <h2 className="text-xl font-semibold">
          Welcome back
        </h2>

        <p className="text-gray-500 text-sm mb-5">
          Sign in to your MedAssist account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">

          <label className="text-sm mt-2">
            Email
          </label>

          <input
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="text-sm mt-3">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="mt-1 mb-2">
            <a className="text-xs text-blue-500 cursor-pointer hover:underline">
              Forgot password?
            </a>
          </div>

          <button className="mt-2 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Sign In
          </button>

        </form>

        <div className="text-center text-xs text-gray-400 my-5">
          OR CONTINUE WITH
        </div>

        <div className="flex gap-3">

          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">

            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              className="w-4 h-4"
            />

            Google

          </button>

          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">

            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
              className="w-4 h-4"
            />

            Apple

          </button>

        </div>

        <p className="text-center text-sm mt-4">
          Don't have an account?
          <span
            className="text-blue-500 cursor-pointer ml-1 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>

      </div>

      <p className="text-xs text-gray-500 mt-6">
        By signing in, you agree to our Terms and Privacy Policy
      </p>

    </div>
  );
};

export default Login;
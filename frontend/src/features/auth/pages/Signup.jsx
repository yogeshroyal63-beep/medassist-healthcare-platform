import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";

const Signup = () => {

  const navigate = useNavigate();

  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const [form,setForm] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:""
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    navigate("/role-selection");
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fb] font-sans">

      {/* Logo */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center relative">
          <div className="absolute w-6 h-[3px] bg-white rounded"></div>
          <div className="absolute h-6 w-[3px] bg-white rounded"></div>
        </div>

        <span className="text-3xl font-bold text-blue-500">
          MedAssist
        </span>

      </div>


      {/* Card */}

      <div className="bg-white w-[500px] p-8 rounded-xl shadow-lg">

        {/* Progress */}

        <div className="w-full h-2 bg-gray-200 rounded mb-4">
          <div className="w-1/2 h-2 bg-blue-500 rounded"></div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Step 1 of 2
        </p>

        <h2 className="text-xl font-semibold">
          Create your account
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Enter your basic information to get started
        </p>


        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}

          <div>
            <label className="text-sm">
              Full Name *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
            />
          </div>


          {/* Email + Phone */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm">
                Email *
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-sm">
                Phone Number *
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

          </div>


          {/* Password */}

          <div className="relative">

            <label className="text-sm">
              Password *
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full border border-gray-300 p-2 rounded-md mt-1 pr-10"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 text-xl"
            >
              {showPassword ? <BiHide/> : <BiShow/>}
            </button>

          </div>


          {/* Confirm Password */}

          <div className="relative">

            <label className="text-sm">
              Confirm Password *
            </label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full border border-gray-300 p-2 rounded-md mt-1 pr-10"
            />

            <button
              type="button"
              onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 text-xl"
            >
              {showConfirmPassword ? <BiHide/> : <BiShow/>}
            </button>

          </div>


          {/* Continue Button */}

          <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Continue to Medical Profile
          </button>

        </form>


        <p className="text-center text-sm mt-4">
          Already have an account?
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={()=>navigate("/login")}
          >
            Sign in
          </span>
        </p>

      </div>


      <p className="text-xs text-gray-500 mt-6">
        By creating an account, you agree to our Terms and Privacy Policy
      </p>

    </div>

  );

};

export default Signup;
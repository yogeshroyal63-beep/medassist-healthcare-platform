import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MedicalProfile = () => {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    dob:"",
    gender:"",
    bloodGroup:"",
    height:"",
    weight:"",
    allergies:"",
    conditions:"",
    emergencyName:"",
    emergencyPhone:""
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

      <div className="bg-white w-[600px] p-8 rounded-xl shadow-lg">

        {/* Progress */}

        <div className="w-full h-2 bg-gray-200 rounded mb-4">
          <div className="w-full h-2 bg-blue-500 rounded"></div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Step 2 of 2
        </p>

        <h2 className="text-xl font-semibold">
          Complete your medical profile
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Help us personalize your healthcare experience
        </p>


        <form onSubmit={handleSubmit} className="space-y-5">


          {/* DOB + Gender */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm">
                Date of Birth *
              </label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-sm">
                Gender *
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

          </div>


          {/* Blood + Height + Weight */}

          <div className="grid grid-cols-3 gap-4">

            <div>
              <label className="text-sm">
                Blood Group *
              </label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              >
                <option>Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            <div>
              <label className="text-sm">
                Height (cm) *
              </label>

              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="170"
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-sm">
                Weight (kg) *
              </label>

              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="70"
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

          </div>


          {/* Allergies */}

          <div>
            <label className="text-sm">
              Known Allergies
            </label>

            <textarea
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="List any known allergies (e.g., penicillin, peanuts)"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
            />
          </div>


          {/* Conditions */}

          <div>
            <label className="text-sm">
              Existing Medical Conditions
            </label>

            <textarea
              name="conditions"
              value={form.conditions}
              onChange={handleChange}
              placeholder="List any existing conditions (e.g., diabetes, hypertension)"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
            />
          </div>


          <hr className="my-4"/>


          {/* Emergency Contact */}

          <h3 className="font-semibold">
            Emergency Contact
          </h3>


          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm">
                Name *
              </label>

              <input
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                placeholder="Emergency contact name"
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-sm">
                Phone Number *
              </label>

              <input
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
              />
            </div>

          </div>


          {/* Buttons */}

          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={()=>navigate("/signup")}
              className="w-full border border-gray-300 py-3 rounded-lg"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
            >
              Create Account
            </button>

          </div>

        </form>

      </div>


      <p className="text-xs text-gray-500 mt-6">
        By creating an account, you agree to our Terms and Privacy Policy
      </p>

    </div>

  );

};

export default MedicalProfile;
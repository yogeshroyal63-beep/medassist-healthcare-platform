import { useNavigate } from "react-router-dom";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import {
  LayoutDashboard,
  Brain,
  Pill,
  Bell,
  Calendar,
  FileText,
  HeartPulse
} from "lucide-react";

const data = [
  { day: "Mon", score: 82 },
  { day: "Tue", score: 85 },
  { day: "Wed", score: 80 },
  { day: "Thu", score: 86 },
  { day: "Fri", score: 84 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: 87 }
];

export default function PatientDashboard() {

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r">

        <div className="p-6 text-xl font-bold text-blue-600">
          MedAssist
        </div>

        <nav className="space-y-1 px-3">

          <button className="flex items-center gap-2 w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded">
            <LayoutDashboard size={18}/>
            Dashboard
          </button>

          <button onClick={()=>navigate("/triage")} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            <Brain size={18}/>
            Smart Check
          </button>

          <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            <Pill size={18}/>
            Medications
          </button>

          <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            <Calendar size={18}/>
            Appointments
          </button>

          <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
            <FileText size={18}/>
            Medical History
          </button>

        </nav>

      </aside>


      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <input
            placeholder="Search doctors, medications..."
            className="border px-3 py-2 rounded-lg w-64"
          />

          <div className="flex items-center gap-4">

            {/* notification */}
            <div className="relative">
              <Bell className="text-gray-600"/>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                2
              </span>
            </div>

            {/* avatar */}
            <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          </div>

        </div>


        {/* WELCOME */}
        <h1 className="text-xl font-semibold mb-4">
          Welcome back 👋
        </h1>


        {/* HEALTH SCORE */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 rounded-xl mb-6">

          <p className="text-sm">Health Confidence Index</p>

          <h2 className="text-3xl font-bold">89</h2>

          <p className="text-sm mb-3">
            +3 improvement this week
          </p>

          {/* progress bar */}
          <div className="h-2 bg-white/30 rounded">
            <div className="h-2 bg-white rounded w-[89%]"></div>
          </div>

        </div>


        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-4 gap-4 mb-6">

          <div
            onClick={()=>navigate("/triage")}
            className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <Brain size={18}/>
            Smart Check
          </div>

          <div className="bg-white p-4 rounded shadow hover:shadow-md flex items-center gap-2">
            <Calendar size={18}/>
            Book Appointment
          </div>

          <div className="bg-white p-4 rounded shadow hover:shadow-md flex items-center gap-2">
            <Pill size={18}/>
            Medications
          </div>

          <div className="bg-white p-4 rounded shadow hover:shadow-md flex items-center gap-2">
            <FileText size={18}/>
            Health Records
          </div>

        </div>


        {/* GRAPH + VITAL SIGNS */}
        <div className="grid grid-cols-3 gap-6 mb-6">

          {/* GRAPH */}
          <div className="col-span-2 bg-white p-6 rounded shadow">

            <h3 className="font-semibold mb-4">
              Health Trend
            </h3>

            <ResponsiveContainer width="100%" height={220}>

              <AreaChart data={data}>

                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="day"/>

                <YAxis/>

                <Tooltip/>

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="url(#healthGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>


          {/* VITAL SIGNS */}
          <div className="bg-white p-6 rounded shadow">

            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <HeartPulse size={18}/>
              Vital Signs
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                Heart Rate
                <span className="font-medium">72 bpm</span>
              </div>

              <div className="flex justify-between">
                Blood Pressure
                <span className="font-medium">120/80</span>
              </div>

              <div className="flex justify-between">
                Weight
                <span className="font-medium">70 kg</span>
              </div>

              <div className="flex justify-between">
                Temperature
                <span className="font-medium">36.8°C</span>
              </div>

            </div>

          </div>

        </div>


        {/* APPOINTMENTS + MEDICATIONS */}
        <div className="grid grid-cols-2 gap-6">

          {/* APPOINTMENTS */}
          <div className="bg-white p-6 rounded shadow">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Upcoming Appointments</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">

                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

                <div>
                  <p className="text-sm font-medium">
                    Dr. Sarah Johnson
                  </p>

                  <p className="text-xs text-gray-500">
                    Feb 14 • 10:00 AM
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">

                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

                <div>
                  <p className="text-sm font-medium">
                    Dr. Michael Chen
                  </p>

                  <p className="text-xs text-gray-500">
                    Feb 15 • 7:30 PM
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* MEDICATIONS */}
          <div className="bg-white p-6 rounded shadow">

            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Today's Medications</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                Lisinopril
                <span className="text-green-600">Taken</span>
              </div>

              <div className="flex justify-between">
                Metformin
                <span className="text-yellow-600">Upcoming</span>
              </div>

              <div className="flex justify-between">
                Aspirin
                <span className="text-gray-600">Later</span>
              </div>

            </div>

          </div>

        </div>


        {/* HEALTH TIP */}
        <div className="bg-blue-50 p-4 rounded mt-6">

          <h4 className="font-semibold mb-1">
            Health Tip of the Day
          </h4>

          <p className="text-sm text-gray-600">
            Drink at least 8 glasses of water daily to stay hydrated.
          </p>

        </div>

      </main>

    </div>
  );
}
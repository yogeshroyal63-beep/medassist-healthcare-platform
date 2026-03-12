import { useState } from "react";
import { Menu, Bell } from "lucide-react";

import HealthSummary from "../components/HealthSummary";
import DashboardCards from "../components/DashboardCards";
import HealthTrendChart from "../components/HealthTrendChart";

export default function PatientDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-56 bg-white border-r transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        <div className="px-6 py-5 text-blue-600 font-semibold text-lg">
          MedAssist
        </div>

        <nav className="px-3 space-y-2 text-sm">

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
            Dashboard
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100">
            Smart Check
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100">
            Medications
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100">
            Reminders
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100">
            Find Doctors
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100">
            Appointments
          </button>

        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 px-8 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Menu size={20}/>
            </button>

            <input
              placeholder="Search..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64"
            />

          </div>

          <div className="flex items-center gap-4">

            <Bell size={18} className="text-gray-500"/>

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

              <div className="text-xs">
                <p className="font-medium">Yogesh Royel</p>
                <p className="text-gray-500">Patient</p>
              </div>

            </div>

          </div>

        </div>

        {/* WELCOME */}
        <h2 className="text-base font-semibold mb-4">
          Welcome back, Yogesh!
        </h2>

        {/* HEALTH SUMMARY */}
        <HealthSummary />

        {/* QUICK ACTION CARDS */}
        <DashboardCards />

        {/* GRAPH + VITAL SIGNS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {/* GRAPH */}
          <div className="col-span-2">
            <HealthTrendChart />
          </div>

          {/* VITAL SIGNS */}
          <div className="bg-white rounded-xl p-4 shadow-sm">

            <h3 className="text-sm font-medium mb-3">
              Vital Signs
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-gray-500 text-xs">Heart Rate</p>
                <p className="font-semibold">72 bpm</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Blood Pressure</p>
                <p className="font-semibold">120/80</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Weight</p>
                <p className="font-semibold">70 kg</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Temperature</p>
                <p className="font-semibold">36.6°C</p>
              </div>

            </div>

          </div>

        </div>

        {/* UPCOMING APPOINTMENTS */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">

          <div className="flex justify-between mb-3">

            <h3 className="text-sm font-medium">
              Upcoming Appointments
            </h3>

            <button className="text-xs text-blue-600">
              View All
            </button>

          </div>

          <div className="space-y-2 text-sm">

            <div className="bg-gray-50 rounded-lg p-3">
              Dr. Sarah Johnson — Feb 14 • 10:00 AM
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              Dr. Michael Chen — Feb 15 • 7:30 PM
            </div>

          </div>

        </div>

        {/* HEALTH TIP */}
        <div className="bg-blue-50 rounded-xl p-4 text-sm">

          <p className="font-medium mb-1">
            Health Tip of the Day
          </p>

          Stay hydrated. Drinking adequate water helps maintain your body's fluid balance.

        </div>

      </main>

    </div>
  );
}
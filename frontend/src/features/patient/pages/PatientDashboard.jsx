import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/button.jsx";
import { Input } from "../components/input.jsx";
import { Avatar, AvatarFallback } from "../components/avatar.jsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu.jsx";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/sheet.jsx";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/tooltip.jsx";

import {
  Heart,
  LayoutDashboard,
  MessageSquare,
  Pill,
  Clock,
  Users,
  Calendar,
  FileText,
  Folder,
  User,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Shield,
  Activity,
} from "lucide-react";



export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("medassist_current_user") || "{}"
  );

  const role = currentUser.role || "patient";

  const handleLogout = () => {
    localStorage.removeItem("medassist_current_user");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const patientNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: MessageSquare, label: "Smart Check", path: "/dashboard/smart-check" },
    { icon: Pill, label: "Medications", path: "/dashboard/medications" },
    { icon: Clock, label: "Reminders", path: "/dashboard/reminders" },
    { icon: Users, label: "Find Doctors", path: "/dashboard/find-doctors" },
    { icon: Calendar, label: "Appointments", path: "/dashboard/appointments" },
    { icon: Activity, label: "Medical History", path: "/dashboard/medical-history" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: Folder, label: "Documents", path: "/dashboard/documents" },
  ];

  const doctorNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
    { icon: Calendar, label: "Appointments", path: "/doctor/appointments" },
    { icon: Users, label: "Patients", path: "/doctor/patients" },
    { icon: MessageSquare, label: "Consultations", path: "/doctor/consultations" },
    { icon: Pill, label: "Prescriptions", path: "/doctor/prescriptions" },
    { icon: FileText, label: "Reports", path: "/doctor/reports" },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Shield, label: "Doctor Verification", path: "/admin/verification" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Activity, label: "Analytics", path: "/admin/analytics" },
    { icon: FileText, label: "Audit Logs", path: "/admin/audit-logs" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const navItems =
    role === "patient"
      ? patientNavItems
      : role === "doctor"
      ? doctorNavItems
      : adminNavItems;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <span className="text-xl font-bold text-blue-600">
                  MedAssist
                </span>
                <p className="text-xs text-gray-500 capitalize">
                  {role} Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t space-y-2">
            <Link
              to={`/${role === "patient" ? "dashboard" : role}/profile`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>

            <Link
              to={`/${role === "patient" ? "dashboard" : role}/settings`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b z-30">
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 bg-gray-100"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(currentUser.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      `/${role === "patient" ? "dashboard" : role}/profile`
                    )
                  }
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      `/${role === "patient" ? "dashboard" : role}/settings`
                    )
                  }
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
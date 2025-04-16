//app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Phone,
  LogOut,
  Calendar,
  Menu,
  X,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import DoctorManagementAdmin from "@/components/admin/DoctorManagementAdmin";
import EmergencyContactsAdmin from "@/components/admin/EmergencyContactsAdmin";
import AppointmentManagementAdmin from "@/components/admin/AppointmentManagementAdmin";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    doctorCount: 0,
    emergencyCount: 0,
    appointmentCount: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
    } else {
      fetchDashboardData();
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setIsFetching(true);
    setError("");
    try {
      const res = await fetch("/admin/dashboard-counts");

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setDashboardData({
          doctorCount: data.doctorCount || 0,
          emergencyCount: data.emergencyCount || 0,
          appointmentCount: data.appointmentCount || 0,
        });
      } else {
        setError("Failed to fetch dashboard data. Please try again.");
        console.error("Failed to fetch dashboard data:", data.message);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again.");
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsMenuOpen(false); // Close mobile menu when showing logout dialog
  };

  const confirmLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false); // Close mobile menu when navigating
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Navigation configuration for reusability
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "doctors", label: "Doctors", icon: Users },
    { id: "emergency", label: "Emergency Contacts", icon: Phone },
    { id: "appointments", label: "Appointments", icon: Calendar },
  ];

  // Stats cards configuration for reusability
  const statCards = [
    {
      id: "doctors",
      label: "Total Doctors",
      value: dashboardData.doctorCount,
      color: "blue",
    },
    {
      id: "emergency",
      label: "Emergency Contacts",
      value: dashboardData.emergencyCount,
      color: "red",
    },
    {
      id: "appointments",
      label: "Appointments",
      value: dashboardData.appointmentCount,
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from your Medicare Admin account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="ml-3 text-xl font-semibold text-blue-600">
            Medicare Admin
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogoutClick}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40">
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-600">
                Medicare Admin
              </h2>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
            <nav className="p-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </button>
              ))}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center p-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={18} className="mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:flex md:w-64 md:flex-col bg-white shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">Medicare Admin</h2>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <nav className="flex-1 p-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`mr-3 ${
                    activeTab === item.id ? "text-blue-600" : "text-gray-500"
                  }`}
                  size={18}
                />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="border-t border-gray-200 my-4"></div>
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="mr-3 text-gray-500" size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {activeTab === "dashboard" && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-0">
                  Medicare Admin Dashboard
                </h1>
                <button
                  onClick={fetchDashboardData}
                  disabled={isFetching}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
                  />
                  Refresh Data
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => navigateTo(card.id)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  >
                    <div className={`h-2 bg-${card.color}-500`}></div>
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-700 mb-3">
                        {card.label}
                      </h2>
                      <div className="flex items-end">
                        <p
                          className={`text-4xl font-bold text-${card.color}-600`}
                        >
                          {card.value}
                        </p>
                        <span className="ml-2 text-gray-500 text-sm mb-1">
                          {card.id === "doctors"
                            ? "registered"
                            : card.id === "emergency"
                            ? "contacts"
                            : "scheduled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    {navigationItems.slice(1).map((item) => (
                      <button
                        key={`quick-${item.id}`}
                        onClick={() => navigateTo(item.id)}
                        className="w-full text-left flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <item.icon size={18} className="mr-3 text-gray-500" />
                          <span>Manage {item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                    System Status
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">API Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Database</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Update</span>
                      <span className="text-gray-500 text-sm">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "doctors" && <DoctorManagementAdmin />}
          {activeTab === "emergency" && <EmergencyContactsAdmin />}
          {activeTab === "appointments" && <AppointmentManagementAdmin />}
        </div>
      </div>
    </div>
  );
}

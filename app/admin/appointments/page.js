"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Filter,
} from "lucide-react";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Apply filters whenever appointments, searchTerm, or statusFilter changes
    applyFilters();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings");

      // For debugging - log response status
      console.log("Response status:", response.status);

      // Get response as text first to examine raw response
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(
          "Server returned an invalid response format. Please try again later."
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch appointments");
      }

      // Sort appointments by date (newest first)
      const sortedAppointments = data.data.sort((a, b) => {
        return new Date(b.appointmentDate) - new Date(a.appointmentDate);
      });

      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
      setError("");
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.message || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.patientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (appointment.doctorName &&
            appointment.doctorName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          appointment.contactNumber.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      // Success message could be added here
    } catch (error) {
      console.error("Error updating appointment status:", error);
      // Error message could be displayed here
    }
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Appointment Management
      </h2>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name, doctor or contact..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="text-gray-500" />
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading appointments...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8 bg-red-50 rounded-xl">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAppointments}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Appointments State */}
      {!isLoading && !error && filteredAppointments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No appointments found</p>
          {searchTerm || statusFilter !== "all" ? (
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          ) : null}
        </div>
      )}

      {/* Appointments List */}
      {!isLoading && !error && filteredAppointments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-medium border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-500" />
                      {appointment.patientName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-blue-500" />
                      {appointment.contactNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {appointment.doctorName || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      {formatDate(appointment.appointmentDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      {appointment.appointmentTime}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : appointment.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800" // pending
                      }`}
                    >
                      {appointment.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "confirmed")
                        }
                        className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        title="Confirm"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "cancelled")
                        }
                        className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        title="Cancel"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;

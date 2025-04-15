"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CalendarIcon,
  Building,
} from "lucide-react";
import Link from "next/link";

// Status badge component
const StatusBadge = ({ status }) => {
  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        status === "confirmed"
          ? "bg-green-100 text-green-800"
          : status === "completed"
          ? "bg-blue-100 text-blue-800"
          : status === "cancelled"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      <Clock className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default function AppointmentsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user appointments
    const fetchAppointments = async () => {
      try {
        setError(null);
        // Get user ID from localStorage
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("User ID not found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching appointments for user:", userId);

        // First try the user-specific endpoint
        const response = await fetch(`/api/appointments/user/${userId}`, {
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        const data = await response.json();
        console.log("Appointments data:", data);

        if (data.success) {
          setAppointments(data.appointments || []);
        } else {
          // If user-specific endpoint fails with an error message, try the general appointments endpoint
          console.warn("User-specific endpoint failed:", data.message);

          const generalResponse = await fetch(`/api/appointments`, {
            credentials: "include",
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          });

          const generalData = await generalResponse.json();
          console.log("General appointments data:", generalData);

          if (generalData.success) {
            // Filter appointments by patient name if possible
            const userName = `${localStorage.getItem("userFirstName") || ""} ${
              localStorage.getItem("userLastName") || ""
            }`.trim();

            const userAppointments = generalData.data.filter(
              (apt) =>
                apt.patientName &&
                apt.patientName.toLowerCase().includes(userName.toLowerCase())
            );

            setAppointments(userAppointments || []);
          } else {
            throw new Error(
              generalData.message || "Failed to fetch appointments"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error.message || "Failed to load appointments");
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchAppointments();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">My Appointments</h1>
          <Link href="/doctors">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="mr-2 h-5 w-5" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <p className="text-sm mt-1">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <CalendarIcon className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any appointments scheduled yet.
            </p>
            <Link href="/doctors">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Find a Doctor
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment, index) => {
              // Get doctor info
              const doctorName = appointment.doctor?.name || "Unknown Doctor";
              const specialty =
                appointment.doctor?.specialty ||
                appointment.doctor?.specialization ||
                "Surgery";

              // Get location and hospital from doctor data first, then fallback to appointment data
              const location =
                appointment.doctor?.location ||
                appointment.location ||
                "Location not specified";
              const hospital =
                appointment.doctor?.hospital || "Hospital not specified";

              return (
                <div
                  key={appointment._id || index}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <div
                    className={`h-2 ${
                      appointment.status === "confirmed"
                        ? "bg-green-500"
                        : appointment.status === "completed"
                        ? "bg-blue-500"
                        : appointment.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="p-6 bg-white">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <User className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold">
                          Dr. {doctorName}
                        </h3>
                        <span className="text-sm text-gray-500 ml-2">
                          ({specialty})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 mt-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Building className="w-4 h-4 mr-2 text-blue-500" />
                          <span>{hospital}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start items-center mt-4">
                      <StatusBadge status={appointment.status || "pending"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  CalendarDays,
  Clock,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth"; // Import the auth context

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const { isLoggedIn, userName } = useAuth(); // Get auth context
  const [formData, setFormData] = useState({
    name: "", // Initialize with empty string
    contact: "",
    date: "",
    time: "",
  });
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Set name from auth context if available, but only if we have actual user data
  useEffect(() => {
    if (isLoggedIn && userName) {
      // Only set the name if firstName or lastName exists
      if (userName.firstName || userName.lastName) {
        setFormData((prev) => ({
          ...prev,
          name: `${userName.firstName || ""} ${userName.lastName || ""}`.trim(),
        }));
      }

      // Get the user email from localStorage
      const email = localStorage.getItem("userEmail");
      if (email) {
        setUserEmail(email);
      }
    }
  }, [isLoggedIn, userName]);

  // Format available days for display
  const availableDaysDisplay =
    doctor.availableDays && doctor.availableDays.length > 0
      ? doctor.availableDays.join(", ")
      : "Contact for availability";

  // Define default time slots
  const defaultTimeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!formData.date) {
      setAvailableTimeSlots(defaultTimeSlots);
      setBookedTimeSlots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      setIsLoadingTimeSlots(true);
      try {
        // Use a fallback approach if the API call fails
        try {
          const response = await fetch(
            `/api/bookings/available-slots?doctorId=${doctor._id}&date=${formData.date}`
          );

          if (response.ok) {
            const data = await response.json();

            if (data.success) {
              setAvailableTimeSlots(data.data.availableTimeSlots || []);
              setBookedTimeSlots(data.data.bookedTimeSlots || []);
              return;
            }
          }

          console.error(
            `Error fetching available slots: ${response.status} ${response.statusText}`
          );
        } catch (error) {
          console.error("Error fetching available slots:", error);
        }

        // Fallback: Use all time slots if API fails
        setAvailableTimeSlots(defaultTimeSlots);
        setBookedTimeSlots([]);
      } finally {
        setIsLoadingTimeSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [doctor._id, formData.date]);

  // Handle date input change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    // Check if the selected date is on an available day
    if (selectedDate) {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const selectedDayName = dayNames[dayOfWeek];

      // Check if the selected day is in the doctor's available days
      if (doctor.availableDays && doctor.availableDays.length > 0) {
        if (!doctor.availableDays.includes(selectedDayName)) {
          alert(
            `Doctor is not available on ${selectedDayName}. Please select from available days: ${availableDaysDisplay}`
          );
          return;
        }
      }
    }

    setFormData({ ...formData, date: selectedDate, time: "" }); // Reset time when date changes
  };

  // Format time for display (e.g., "09:00" to "09:00 AM")
  const formatTimeForDisplay = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours, 10);

    if (hour < 12) {
      return `${hours}:${minutes} AM`;
    } else if (hour === 12) {
      return `${hours}:${minutes} PM`;
    } else {
      return `${(hour - 12).toString().padStart(2, "0")}:${minutes} PM`;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First, create the booking in the database
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctor: doctor._id,
          patientName: formData.name,
          contactNumber: formData.contact,
          appointmentDate: formData.date,
          appointmentTime: formData.time,
        }),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }

      const bookingData = await bookingResponse.json();
      console.log("Booking created successfully:", bookingData);

      // Then, send email notification (silently in the background)
      try {
        // Send email notification without showing status to user
        await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: doctor._id,
            patientName: formData.name,
            contactNumber: formData.contact,
            appointmentDate: formData.date,
            appointmentTime: formData.time,
            patientEmail: userEmail, // Use email from state
          }),
        });
        // No status updates to the user about email
      } catch (emailError) {
        // Log error but don't show to user
        console.warn("Email notification failed:", emailError);
      }

      // Booking successful
      setIsBooked(true);
      setTimeout(() => {
        setIsBooked(false);
        onClose();
        setFormData({ name: "", contact: "", date: "", time: "" });
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Combine all time slots and mark which ones are booked
  const allTimeSlotsWithStatus = defaultTimeSlots.map((time) => ({
    time,
    isBooked: bookedTimeSlots.includes(time),
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 transform slideIn">
        {!isBooked ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Book Appointment
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Doctor Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-blue-800">{doctor.name}</h3>
              <p className="text-blue-600">
                {doctor.specialization || doctor.specialty}
              </p>
              <p className="text-blue-600">{doctor.hospital}</p>
              <p className="text-blue-600">{doctor.location}</p>
              <p className="text-blue-600">
                Consultation Fee: ${doctor.consultationFee}
              </p>
              <p className="text-blue-600 mt-2">
                <span className="font-medium">Available Days:</span>{" "}
                {availableDaysDisplay}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Your Name</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Contact Number</span>
                </label>
                <input
                  required
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your contact number"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Preferred Date</span>
                  {doctor.availableDays && doctor.availableDays.length > 0 && (
                    <span className="ml-2 text-xs text-blue-600">
                      (Only {availableDaysDisplay} available)
                    </span>
                  )}
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Preferred Time</span>
                </label>
                {isLoadingTimeSlots ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                    <span>Loading available times...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {allTimeSlotsWithStatus.map(({ time, isBooked }) => (
                      <button
                        key={time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          formData.time === time
                            ? "bg-blue-500 text-white border-blue-500"
                            : isBooked
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {formatTimeForDisplay(time)}
                        {isBooked && (
                          <span className="block text-xs">(Booked)</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.date || !formData.time}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 text-center success">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600">
              Your appointment has been scheduled with {doctor.name} for{" "}
              {new Date(formData.date).toLocaleDateString()} at{" "}
              {formatTimeForDisplay(formData.time)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

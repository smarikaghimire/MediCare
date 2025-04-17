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
import { useAuth } from "@/lib/hooks/useAuth";

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const { isLoggedIn, userName } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
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

  // Set name from auth context if available
  useEffect(() => {
    if (isLoggedIn && userName) {
      if (userName.firstName || userName.lastName) {
        setFormData((prev) => ({
          ...prev,
          name: `${userName.firstName || ""} ${userName.lastName || ""}`.trim(),
        }));
      }
      const email = localStorage.getItem("userEmail");
      if (email) setUserEmail(email);
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

  // Check if a time slot has passed for the current day
  const isTimeSlotPassed = (time) => {
    if (!formData.date) return false;

    const today = new Date();
    const selectedDate = new Date(formData.date);

    // Only check for current day
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }

    // Parse the time slot
    const [hours, minutes] = time.split(":").map(Number);

    // Compare with current time
    return (
      today.getHours() > hours ||
      (today.getHours() === hours && today.getMinutes() >= minutes)
    );
  };

  // Handle date input change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    // Check if the selected date is on an available day
    if (selectedDate) {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay();
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

    // Reset time when date changes to avoid invalid selections
    setFormData({ ...formData, date: selectedDate, time: "" });
  };

  // Handle contact input change with validation for max 10 digits
  const handleContactChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setFormData({ ...formData, contact: digitsOnly });
    }
  };

  // Format time for display
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours, 10);
    if (hour < 12) return `${hours}:${minutes} AM`;
    else if (hour === 12) return `${hours}:${minutes} PM`;
    else return `${(hour - 12).toString().padStart(2, "0")}:${minutes} PM`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Additional validation to prevent booking past slots
      if (isTimeSlotPassed(formData.time)) {
        throw new Error("Cannot book a time slot that has already passed");
      }

      // Create the booking in the database
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

      // Send email notification (silently in the background)
      try {
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
            patientEmail: userEmail,
          }),
        });
      } catch (emailError) {
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

  // Combine all time slots and mark which ones are booked or passed
  const allTimeSlotsWithStatus = defaultTimeSlots.map((time) => {
    const isSlotBooked = bookedTimeSlots.includes(time);
    const isSlotPassed = isTimeSlotPassed(time);

    return {
      time,
      isBooked: isSlotBooked,
      isPassed: isSlotPassed,
      // This will determine what status text to show
      status: isSlotBooked
        ? isSlotPassed
          ? "Passed"
          : "Booked"
        : isSlotPassed
        ? "Passed"
        : "",
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center fadeIn">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl transform slideIn">
        {!isBooked ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Book Appointment
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Doctor Info Card */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 text-lg mb-2">
                {doctor.name}
              </h3>
              <div className="flex justify-between mb-2">
                <span className="text-blue-700 font-medium">
                  {doctor.specialization || doctor.specialty}
                </span>
                <span className="text-blue-700 font-medium">
                  Fee: Rs.{doctor.consultationFee}
                </span>
              </div>
              <div className="text-sm text-blue-600 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                Available: {availableDaysDisplay}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-5 flex items-center">
                <X className="w-5 h-5 mr-2 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Full Name</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Contact input with max 10 digits validation */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Contact Number</span>
                </label>
                <input
                  required
                  type="tel"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter contact number "
                  value={formData.contact}
                  onChange={handleContactChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit contact number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid 10 digit contact number
                </p>
              </div>

              {/* Date input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Appointment Date</span>
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Time selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Appointment Time</span>
                </label>
                {isLoadingTimeSlots ? (
                  <div className="flex items-center justify-center py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                    <span className="text-gray-600">
                      Loading available times...
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {allTimeSlotsWithStatus.map(
                      ({ time, isBooked, isPassed, status }) => (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked || isPassed}
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-2 px-2 rounded-lg border text-center transition-all ${
                            formData.time === time
                              ? "bg-blue-500 text-white border-blue-500 shadow-md"
                              : isBooked || isPassed
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:shadow-sm"
                          }`}
                        >
                          <span className="block text-sm font-medium">
                            {formatTimeForDisplay(time)}
                          </span>
                          {status && (
                            <span className="block text-xs mt-1">
                              ({status})
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !formData.date || !formData.time}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 text-base font-medium flex items-center justify-center mt-6 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Appointment"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment with{" "}
              <span className="font-medium text-gray-800">{doctor.name}</span>{" "}
              is scheduled for{" "}
              <span className="font-medium text-gray-800">
                {new Date(formData.date).toLocaleDateString()}
              </span>{" "}
              at{" "}
              <span className="font-medium text-gray-800">
                {formatTimeForDisplay(formData.time)}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email
              address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

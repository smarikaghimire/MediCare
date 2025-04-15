//components/available-date-picker.tsx for letting users select only that date where doctors are available 
"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { isDateAvailable } from "@/lib/utils/date-utils";

const AvailableDatePicker = ({
  availableDays,
  value,
  onChange,
  className = "",
  label = "Select Date",
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );

  // Update the calendar when the value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Close the calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCalendar && !e.target.closest(".date-picker-container")) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format date for display (e.g., "Apr 9, 2023")
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if a date is in the past
  const isPastDate = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(year, month, day);
    return date < today;
  };

  // Handle date selection
  const handleDateSelect = (year, month, day) => {
    const date = new Date(year, month, day);
    const formattedDate = formatDate(date);

    // Check if the date is available based on doctor's available days
    if (isDateAvailable(formattedDate, availableDays)) {
      setSelectedDate(date);
      onChange(formattedDate);
      setShowCalendar(false);
    } else {
      alert(
        `Doctor is not available on ${date.toLocaleDateString("en-US", {
          weekday: "long",
        })}. Please select from available days: ${availableDays.join(", ")}`
      );
    }
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Render calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Create array of day names
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Create array of days
    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 absolute top-full left-0 mt-2 z-10 w-72">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            &lt;
          </button>
          <div className="font-medium">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Day names */}
          {dayNames.map((day, index) => (
            <div
              key={`header-${index}`}
              className="text-center text-xs font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-8"></div>;
            }

            const date = new Date(year, month, day);
            const dateString = formatDate(date);
            const isAvailable = isDateAvailable(dateString, availableDays);
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;
            const isPast = isPastDate(year, month, day);

            return (
              <button
                key={`day-${index}`}
                type="button"
                disabled={isPast || !isAvailable}
                onClick={() => handleDateSelect(year, month, day)}
                className={`h-8 w-8 flex items-center justify-center rounded-full text-sm
                  ${isSelected ? "bg-blue-600 text-white" : ""}
                  ${
                    !isSelected && isAvailable && !isPast
                      ? "hover:bg-blue-100"
                      : ""
                  }
                  ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                  ${
                    !isAvailable && !isPast
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center text-gray-700">
        <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
        <span>{label}</span>
        {availableDays && availableDays.length > 0 && (
          <span className="ml-2 text-xs text-blue-600">
            (Only {availableDays.join(", ")} available)
          </span>
        )}
      </label>

      <div className="relative date-picker-container">
        <input
          type="text"
          readOnly
          placeholder="Select date"
          value={value ? formatDateForDisplay(value) : ""}
          onClick={() => setShowCalendar(!showCalendar)}
          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer ${className}`}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <CalendarDays className="w-5 h-5 text-gray-400" />
        </div>

        {showCalendar && renderCalendar()}
      </div>
    </div>
  );
};

export default AvailableDatePicker;

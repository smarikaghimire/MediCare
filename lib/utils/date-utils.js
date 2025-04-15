/**
 * Formats time for display (e.g., "09:00" to "09:00 AM")
 * @param {string} time - Time in 24-hour format (e.g., "14:00")
 * @returns {string} - Formatted time (e.g., "02:00 PM")
 */
export const formatTimeForDisplay = (time) => {
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

/**
 * Converts day names to day numbers (0 = Sunday, 1 = Monday, etc.)
 */
export const dayNameToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Converts day numbers to day names (0 = Sunday, 1 = Monday, etc.)
 */
export const dayNumberToName = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/**
 * Checks if a date falls on one of the available days
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @param {string[]} availableDays - Array of day names (e.g., ["Monday", "Wednesday"])
 * @returns {boolean} - Whether the date is available
 */
export const isDateAvailable = (dateString, availableDays) => {
  if (!availableDays || availableDays.length === 0) return true;

  const date = new Date(dateString);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayName = dayNumberToName[dayOfWeek];

  return availableDays.includes(dayName);
};

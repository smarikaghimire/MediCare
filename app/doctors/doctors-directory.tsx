//app/doctors/doctors-directory.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Award,
  Search,
  MapPinned,
  Calendar,
  Loader2,
  Lock,
  Mail,
  DollarSign,
  Wallet,
  Briefcase,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import BookingModal from "@/components/booking-modal";

// Keep your existing modal styles
const modalStyles = `
.fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.slideIn {
  animation: slideIn 0.3s ease-out;
}

.success {
  animation: success 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes success {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
`;

// Keep your existing LoginOverlay component
const LoginOverlay = () => {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 bg-white/80 backdrop-blur-md z-40 flex items-center justify-center fadeIn"
      role="dialog"
      aria-labelledby="login-required-title"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-blue-600" aria-hidden="true" />
        </div>
        <h2
          id="login-required-title"
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          Login Required
        </h2>
        <p className="text-gray-600 mb-6">
          To view the full doctor directory and book appointments, please log in
          to your account.
        </p>
        <button
          onClick={() => router.push("/Login")}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 font-medium"
          aria-label="Go to login page"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

// Keep your existing DaysDisplay component
const DaysDisplay = ({ availableDays }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // If no available days provided, show a message
  if (!availableDays || availableDays.length === 0) {
    return <span className="text-gray-500">Contact for availability</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {days.map((day) => {
        const isAvailable = availableDays.includes(day);
        return (
          <span
            key={day}
            className={`text-xs px-2 py-1 rounded ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-400 line-through"
            }`}
            title={
              isAvailable ? `Available on ${day}` : `Not available on ${day}`
            }
          >
            {day.slice(0, 3)}
          </span>
        );
      })}
    </div>
  );
};

// Updated DoctorsDirectory component with better data handling and SEO enhancements
const DoctorsDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Ref for main content section for accessibility
  const mainContentRef = useRef(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/doctors");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch doctors");
        }

        if (data.success && data.data) {
          // Process doctors data to ensure all needed fields exist and normalize values
          const processedDoctors = data.data.map((doctor) => {
            // Make a copy to avoid direct mutation
            const doctorData = { ...doctor };

            // Standardize on specialty field
            doctorData.specialty =
              doctorData.specialization || doctorData.specialty || "";

            // Normalize location values by trimming and ensuring consistent case
            if (doctorData.location) {
              doctorData.location = doctorData.location.trim();

              // Optionally normalize case to ensure consistency
              // doctorData.location = doctorData.location.charAt(0).toUpperCase() +
              //                      doctorData.location.slice(1).toLowerCase();
            }

            return doctorData;
          });

          setDoctors(processedDoctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique locations from fetched doctors, filtering out empty values and normalizing case
  const locations = doctors
    .filter((doctor) => Boolean(doctor.location))
    .map((doctor) => doctor.location.trim())
    .filter(
      (location, index, self) =>
        // Using indexOf to ensure only the first occurrence of each location is kept
        self.indexOf(location) === index
    )
    .sort(); // Sorting locations alphabetically for better UX

  // Get unique specialties, with improved deduplication
  const specialties = doctors
    .filter((doctor) => Boolean(doctor.specialty))
    .map((doctor) => doctor.specialty.trim().toLowerCase())
    .filter((specialty, index, self) => self.indexOf(specialty) === index)
    .map((specialty) => specialty.charAt(0).toUpperCase() + specialty.slice(1)) // Capitalize first letter
    .sort(); // Sorting specialties alphabetically

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase());

    // Case-insensitive location matching
    const matchesLocation =
      selectedLocation === "" ||
      (doctor.location &&
        doctor.location.trim().toLowerCase() ===
          selectedLocation.trim().toLowerCase());

    // Case-insensitive specialty matching
    const matchesSpecialty =
      selectedSpecialty === "" ||
      (doctor.specialty &&
        doctor.specialty.trim().toLowerCase() ===
          selectedSpecialty.trim().toLowerCase());

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  // Only show a limited number of doctors for non-logged in users
  const displayedDoctors = isLoggedIn
    ? filteredDoctors
    : filteredDoctors.slice(0, 3); // Only show first 3 doctors to non-logged in users

  const handleBooking = (doctor) => {
    if (!isLoggedIn) {
      router.push("/Login");
      return;
    }
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  // Function to check if a value is properly present
  const hasValue = (value) => {
    return value !== undefined && value !== null && value !== "";
  };

  // Handler for location selection
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  // Update URL with search parameters for better SEO (retaining browser history)
  useEffect(() => {
    if (searchTerm || selectedLocation || selectedSpecialty) {
      const searchParams = new URLSearchParams();

      if (searchTerm) searchParams.set("search", searchTerm);
      if (selectedLocation) searchParams.set("location", selectedLocation);
      if (selectedSpecialty) searchParams.set("specialty", selectedSpecialty);

      // Update URL without page reload
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    }
  }, [searchTerm, selectedLocation, selectedSpecialty]);

  return (
    <>
      <style jsx global>
        {modalStyles}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Find Your Perfect Doctor
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert healthcare professionals at your service
            </p>

            {/* Search and Filter Section */}
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Search Bar */}
              <div
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? "scale-105" : ""
                }`}
              >
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <label htmlFor="doctor-search" className="sr-only">
                  Search doctors
                </label>
                <input
                  id="doctor-search"
                  type="text"
                  placeholder="Search by doctor name, specialty, or hospital..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Search by doctor name, specialty, or hospital"
                  aria-controls="doctors-results"
                />
              </div>

              {/* Filters: Location and Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Filter */}
                {locations.length > 0 && (
                  <div className="relative">
                    <MapPinned
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <label htmlFor="location-filter" className="sr-only">
                      Filter by location
                    </label>
                    <select
                      id="location-filter"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white cursor-pointer transition-all duration-300"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      aria-label="Filter by location"
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Specialty Filter */}
                {specialties.length > 0 && (
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <label htmlFor="specialty-filter" className="sr-only">
                      Filter by specialty
                    </label>
                    <select
                      id="specialty-filter"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white cursor-pointer transition-all duration-300"
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      aria-label="Filter by specialty"
                    >
                      <option value="">All Specialties</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content section with search results */}
          <main ref={mainContentRef} id="doctors-results" aria-live="polite">
            {/* Loading State */}
            {isLoading && (
              <div
                className="flex justify-center items-center py-20"
                aria-busy="true"
              >
                <Loader2
                  className="w-10 h-10 text-blue-500 animate-spin"
                  aria-hidden="true"
                />
                <span className="ml-3 text-xl text-gray-600">
                  Loading doctors...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div
                className="text-center py-12 bg-red-50 rounded-xl"
                role="alert"
                aria-labelledby="error-message"
              >
                <p id="error-message" className="text-xl text-red-600">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Doctors Grid */}
            {!isLoading && !error && (
              <>
                {/* Results count for screen readers */}
                <div className="sr-only" aria-live="polite">
                  {displayedDoctors.length} doctors found
                  {!isLoggedIn &&
                    filteredDoctors.length > 3 &&
                    `, showing only first 3 results. ${
                      filteredDoctors.length - 3
                    } more doctors available after login.`}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                  {displayedDoctors.map((doctor) => (
                    <article
                      key={doctor._id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                      itemScope
                      itemType="https://schema.org/Physician"
                    >
                      <div className="p-6">
                        <div className="flex flex-col items-center">
                          {/* Doctor Image */}
                          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-500 group-hover:border-indigo-600 transition-colors relative">
                            <Image
                              src={doctor.imageUrl || "/default-doctor.jpg"}
                              alt={`Portrait of Dr. ${doctor.name}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 128px) 100vw, 128px"
                              itemProp="image"
                              priority={doctor._id === displayedDoctors[0]._id}
                            />
                          </div>

                          {/* Doctor Info */}
                          <h2
                            className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors"
                            itemProp="name"
                          >
                            {doctor.name}
                          </h2>
                          <p
                            className="text-indigo-600 font-medium mb-4"
                            itemProp="medicalSpecialty"
                          >
                            {doctor.specialty}
                          </p>

                          <div className="w-full space-y-3">
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Building
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <span itemProp="worksFor">
                                {hasValue(doctor.hospital)
                                  ? doctor.hospital
                                  : "Not specified"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Mail
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <span itemProp="email">
                                {hasValue(doctor.email)
                                  ? doctor.email
                                  : "Not available"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Award
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <span>
                                {hasValue(doctor.experience)
                                  ? `${doctor.experience} years experience`
                                  : "Experience not specified"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Phone
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <span itemProp="telephone">
                                {hasValue(doctor.phone)
                                  ? doctor.phone
                                  : "Not available"}
                              </span>
                            </div>
                            <div
                              className="flex items-center space-x-3 text-gray-600"
                              itemProp="address"
                              itemScope
                              itemType="https://schema.org/PostalAddress"
                            >
                              <MapPin
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <span itemProp="addressLocality">
                                {hasValue(doctor.location)
                                  ? doctor.location
                                  : "Not specified"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Wallet
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <span>
                                Fee:{" "}
                                <span itemProp="priceRange">
                                  {hasValue(doctor.consultationFee)
                                    ? `Rs.${doctor.consultationFee}`
                                    : "Not specified"}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                              <Calendar
                                className="w-5 h-5 text-indigo-500"
                                aria-hidden="true"
                              />
                              <div className="flex-1">
                                <DaysDisplay
                                  availableDays={doctor.availableDays}
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 font-medium"
                            onClick={() => handleBooking(doctor)}
                            aria-label={`Book appointment with ${doctor.name}`}
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {/* Message for limited results when not logged in */}
            {!isLoggedIn &&
              !isLoading &&
              !error &&
              filteredDoctors.length > 3 && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">
                      {filteredDoctors.length - 3}
                    </span>{" "}
                    more doctors available. Log in to see all results.
                  </p>
                  <button
                    onClick={() => router.push("/Login")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    aria-label="Log in to see all doctors"
                  >
                    Log In to See All
                  </button>
                </div>
              )}

            {/* No Results Message */}
            {!isLoading && !error && filteredDoctors.length === 0 && (
              <div className="text-center py-12" role="alert">
                <p className="text-xl text-gray-600">
                  No doctors found matching your criteria.
                </p>
                <p className="mt-4 text-gray-500">
                  Try adjusting your search terms or filters to find more
                  results.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Login Overlay for non-authenticated users */}
      {!isLoggedIn && <LoginOverlay />}

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </>
  );
};

export default DoctorsDirectory;

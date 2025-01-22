"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Award,
  Search,
  MapPinned,
  Calendar,
  Clock,
  User,
  CheckCircle,
  X,
  CalendarDays,
} from "lucide-react";

const doctors = [
  {
    name: "Dr. Ram Bahadur Thapa",
    specialty: "Cardiologist",
    hospital: "Bir Hospital",
    qualification: "MD, FACC",
    contact: "+977-9801234567",
    location: "Kathmandu",
    image: "/images/doctor2.webp",
  },
  {
    name: "Dr. Sita Maharjan",
    specialty: "Pediatrician",
    hospital: "Patan Hospital",
    qualification: "MD, FAAP",
    contact: "+977-9812345678",
    location: "Lalitpur",
    image: "/images/doctor1.webp",
  },
  {
    name: "Dr. Krishna Shrestha",
    specialty: "Orthopedic Surgeon",
    hospital: "NAMS Hospital",
    qualification: "MD, FAAOS",
    contact: "+977-9841234567",
    location: "Pokhara",
    image: "/images/doctor3.webp",
  },
  {
    name: "Dr. Anjana Koirala",
    specialty: "Neurologist",
    hospital: "Dharan Hospital",
    qualification: "MD, PhD",
    contact: "+977-9861234567",
    location: "Dharan",
    image: "/images/doctor4.webp",
  },
  {
    name: "Dr. Suraj Gurung",
    specialty: "Dermatologist",
    hospital: "Pokhara Skin Care Clinic",
    qualification: "MD, FAAD",
    contact: "+977-9821234567",
    location: "Chitwan",
    image: "/images/doctor5.webp",
  },
  {
    name: "Dr. Rachana Tamang",
    specialty: "Gynecologist",
    hospital: "Paropakar Maternity Hospital",
    qualification: "MD, FACOG",
    contact: "+977-9807654321",
    location: "Bhaktapur",
    image: "/images/doctor7.webp",
  },
  {
    name: "Dr. Binod Pradhan",
    specialty: "Psychiatrist",
    hospital: "Mental Wellness Nepal",
    qualification: "MD, FAPA",
    contact: "+977-9817654321",
    location: "Butwal",
    image: "/images/doctor6.webp",
  },
];

const locations = [...new Set(doctors.map((doctor) => doctor.location))];
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

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
  });
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
      setFormData({ name: "", contact: "", date: "", time: "" });
    }, 2000);
  };

  if (!isOpen) return null;

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
              <p className="text-blue-600">{doctor.specialty}</p>
              <p className="text-blue-600">{doctor.hospital}</p>
            </div>

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
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Preferred Time</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                >
                  <option value="">Select time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 font-medium"
              >
                Confirm Booking
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
              {formData.date} at {formData.time}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const DoctorsDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === "" || doctor.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor name, specialty, or hospital..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <MapPinned className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white cursor-pointer transition-all duration-300"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    {/* Doctor Image */}
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-500 group-hover:border-indigo-600 transition-colors relative">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 128px) 100vw, 128px"
                      />
                    </div>

                    {/* Doctor Info */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {doctor.name}
                    </h2>
                    <p className="text-indigo-600 font-medium mb-4">
                      {doctor.specialty}
                    </p>

                    <div className="w-full space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-indigo-500" />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Award className="w-5 h-5 text-indigo-500" />
                        <span>{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Phone className="w-5 h-5 text-indigo-500" />
                        <span>{doctor.contact}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <MapPinned className="w-5 h-5 text-indigo-500" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>

                    <button
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 font-medium"
                      onClick={() => handleBooking(doctor)}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No doctors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
      />
    </>
  );
};

export default DoctorsDirectory;

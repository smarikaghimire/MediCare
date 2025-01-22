"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Phone,
  AlertCircle,
  MapPin,
  Navigation,
  Map,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const emergencyContacts = [
  {
    name: "Emergency Room",
    numbers: [{ name: "General", number: "+977 911" }],
  },
  {
    name: "Poison Control",
    numbers: [{ name: "National Helpline", number: "+977 1-800-222-1222" }],
  },
  {
    name: "Hospital Hotline",
    numbers: [
      { name: "City Hospital", number: "+977 1 234 567 8900" },
      { name: "County Medical", number: "+977 1 234 567 8905" },
    ],
  },
  {
    name: "Ambulance Service",
    numbers: [{ name: "Rapid Response", number: "+977 1 234 567 8901" }],
  },
  {
    name: "Fire Department",
    numbers: [
      { name: "Station 1", number: "+977 1 234 567 8902" },
      { name: "Station 2", number: "+977 1 234 567 8910" },
      { name: "Station 3", number: "+977 1 234 567 8915" },
    ],
  },
  {
    name: "Police Department",
    numbers: [
      { name: "Local Precinct", number: "+977 1 234 567 8903" },
      { name: "Highway Patrol", number: "+977 1 234 567 8920" },
    ],
  },
];

export default function Emergency() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const filteredContacts = emergencyContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLocation = () => {
    setLocationStatus("loading");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus("success");
        },
        () => {
          setLocationStatus("error");
        }
      );
    } else {
      setLocationStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              className="text-3xl font-bold text-red-600 flex items-center gap-2 font-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Phone className="h-8 w-8" />
              Emergency Contacts
            </motion.h1>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Get Help Button */}
              <motion.button
                onClick={() => setIsHelpVisible(!isHelpVisible)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                whileHover={{ scale: 1.1 }}
              >
                Get Help
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Emergency Alert */}
        {isHelpVisible && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="mb-8 border-red-500 bg-red-50 animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2">
                If you are experiencing a medical emergency, please dial{" "}
                <span className="font-bold text-red-600">+977 911</span>{" "}
                immediately.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Location Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-red-500" />
                Share Your Location
              </h2>
              <p className="text-gray-600">
                Allow us to find emergency services nearest to you
              </p>
            </div>
            <button
              onClick={getLocation}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <Navigation className="h-5 w-5" />
              {locationStatus === "loading"
                ? "Getting Location..."
                : "Get My Location"}
            </button>
          </motion.div>

          {location && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Your coordinates: {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </p>
            </div>
          )}

          {locationStatus === "error" && (
            <div className="mt-4 text-red-500">
              Unable to get your location. Please enable location services.
            </div>
          )}
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {contact.name}
                </h2>
                <ul className="space-y-3">
                  {contact.numbers.map((number, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <span className="font-medium">{number.name}</span>
                      <a
                        href={`tel:${number.number}`}
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        {number.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Nearby Emergency Services
          </h2>
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">
              Map would be displayed here with nearby emergency services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

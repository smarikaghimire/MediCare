"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Phone,
  AlertCircle,
  MapPin,
  Navigation,
  MapIcon,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Emergency() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nearbyServices, setNearbyServices] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Load OpenStreetMap scripts
  useEffect(() => {
    const loadMapScripts = async () => {
      if (typeof window !== "undefined" && !window.L) {
        // Load Leaflet CSS
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(linkEl);

        // Load Leaflet JS
        const scriptEl = document.createElement("script");
        scriptEl.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        scriptEl.async = true;
        scriptEl.onload = () => setMapLoaded(true);
        document.body.appendChild(scriptEl);
      } else if (window.L) {
        setMapLoaded(true);
      }
    };

    loadMapScripts();
  }, []);

  // Fetch emergency contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("🔄 Fetching emergency contacts...");

        const response = await fetch("/api/emergency-contacts");
        console.log("📡 API Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ API error response:", errorText);
          throw new Error(
            `Failed to fetch emergency contacts: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("✅ Received data:", data);

        // Handle both response formats - direct array or {success, data} object
        if (Array.isArray(data)) {
          console.log("📡 Contacts fetched successfully", data);
          setEmergencyContacts(data);
        } else if (data.success) {
          console.log("📡 Contacts fetched successfully", data.data);
          setEmergencyContacts(data.data);
        } else {
          console.error("❌ API Error:", data.error);
          throw new Error(data.error || "Failed to get contacts data");
        }
      } catch (err) {
        console.error("❌ Error fetching emergency contacts:", err);
        setError(`Unable to load emergency contacts: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [retryCount]);

  // Initialize map when both location and map scripts are ready
  useEffect(() => {
    if (mapLoaded && location && mapRef.current && window.L) {
      // Clear previous map instance if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize the map centered at user's location
      const map = window.L.map(mapRef.current).setView(
        [location.latitude, location.longitude],
        14
      );

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add user marker
      const userIcon = window.L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center animate-pulse"></div>`,
        className: "",
        iconSize: [24, 24],
      });

      window.L.marker([location.latitude, location.longitude], {
        icon: userIcon,
      })
        .addTo(map)
        .bindPopup("Your location")
        .openPopup();

      // Sample nearby emergency services data - replace with real API call
      // Fixed: Removed duplicate IDs by using unique IDs for each service
      const mockEmergencyServices = [
        {
          id: 1,
          name: "City Hospital",
          type: "hospital",
          coords: [location.latitude + 0.009, location.longitude + 0.005],
          contact: "+977 01-4467891",
        },
        {
          id: 2,
          name: "Central Police Station",
          type: "police",
          coords: [location.latitude - 0.005, location.longitude + 0.008],
          contact: "+977 01-5432198",
        },
        {
          id: 3,
          name: "Fire Department",
          type: "fire",
          coords: [location.latitude + 0.003, location.longitude - 0.007],
          contact: "+977 01-5678432",
        },
        {
          id: 4,
          name: "Community Health Center",
          type: "clinic",
          coords: [location.latitude - 0.008, location.longitude - 0.004],
          contact: "+977 01-4325678",
        },
        {
          id: 5,
          name: "City Hospital Branch",
          type: "hospital",
          coords: [location.latitude + 0.009, location.longitude + 0.005],
          contact: "+977 01-4467891",
        },
        {
          id: 6,
          name: "District Police Station",
          type: "police",
          coords: [location.latitude - 0.005, location.longitude + 0.008],
          contact: "+977 01-5432198",
        },
        {
          id: 7,
          name: "Emergency Fire Services",
          type: "fire",
          coords: [location.latitude + 0.003, location.longitude - 0.007],
          contact: "+977 01-5678432",
        },
        {
          id: 8,
          name: "Primary Health Center",
          type: "clinic",
          coords: [location.latitude - 0.008, location.longitude - 0.004],
          contact: "+977 01-4325678",
        },
        {
          id: 9,
          name: "Manipal Teaching Hospital",
          type: "hospital",
          coords: [location.latitude + 0.025, location.longitude - 0.015],
          contact: "+977 061-526416",
        },
        {
          id: 10,
          name: "Western Regional Hospital",
          type: "hospital",
          coords: [location.latitude - 0.02, location.longitude + 0.03],
          contact: "+977 061-520259",
        },
        {
          id: 11,
          name: "Gandaki Medical College",
          type: "hospital",
          coords: [location.latitude + 0.04, location.longitude + 0.01],
          contact: "+977 061-538595",
        },
        {
          id: 12,
          name: "Pokhara Metropolitan Police",
          type: "police",
          coords: [location.latitude - 0.018, location.longitude + 0.022],
          contact: "+977 061-420033",
        },
        {
          id: 13,
          name: "Ward Police Office, Lakeside",
          type: "police",
          coords: [location.latitude + 0.015, location.longitude - 0.035],
          contact: "+977 061-463462",
        },
        {
          id: 14,
          name: "Pokhara Fire Brigade",
          type: "fire",
          coords: [location.latitude - 0.03, location.longitude - 0.025],
          contact: "+977 061-520700",
        },
        {
          id: 15,
          name: "Fewa City Hospital",
          type: "hospital",
          coords: [location.latitude + 0.035, location.longitude - 0.03],
          contact: "+977 061-523444",
        },
        {
          id: 16,
          name: "Charak Memorial Hospital",
          type: "hospital",
          coords: [location.latitude - 0.025, location.longitude - 0.035],
          contact: "+977 061-533600",
        },
      ];

      // Save to state
      setNearbyServices(mockEmergencyServices);

      // Create custom icons for emergency services
      const createServiceIcon = (type) => {
        let backgroundColor;
        let iconHtml;

        switch (type) {
          case "hospital":
            backgroundColor = "bg-red-600";
            iconHtml = `<span class="text-white font-bold">H</span>`;
            break;
          case "police":
            backgroundColor = "bg-blue-600";
            iconHtml = `<span class="text-white font-bold">P</span>`;
            break;
          case "fire":
            backgroundColor = "bg-orange-600";
            iconHtml = `<span class="text-white font-bold">F</span>`;
            break;
          case "clinic":
            backgroundColor = "bg-green-600";
            iconHtml = `<span class="text-white font-bold">C</span>`;
            break;
          default:
            backgroundColor = "bg-gray-600";
            iconHtml = `<span class="text-white font-bold">?</span>`;
        }

        return window.L.divIcon({
          html: `<div class="w-8 h-8 rounded-full ${backgroundColor} flex items-center justify-center shadow-lg">${iconHtml}</div>`,
          className: "",
          iconSize: [32, 32],
        });
      };

      // Add markers for emergency services
      mockEmergencyServices.forEach((service) => {
        const serviceIcon = createServiceIcon(service.type);

        window.L.marker(service.coords, { icon: serviceIcon }).addTo(map)
          .bindPopup(`
            <div class="font-sans">
              <h3 class="font-bold">${service.name}</h3>
              <p>Contact: <a href="tel:${service.contact}" class="text-blue-600">${service.contact}</a></p>
            </div>
          `);
      });

      // Save map instance for cleanup
      mapInstanceRef.current = map;
    }
  }, [mapLoaded, location]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Filter contacts based on search query
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

  // For development/testing - sample contacts when API fails
  const sampleContacts = [
    {
      _id: "sample1",
      name: "Emergency Room",
      numbers: [{ name: "General", number: "100" }],
    },
    {
      _id: "sample2",
      name: "Poison Control",
      numbers: [{ name: "National Helpline", number: "061 567893" }],
    },
    {
      _id: "sample3",
      name: "Ambulance Service",
      numbers: [{ name: "Rapid Response", number: "104" }],
    },
  ];

  // If there's an error and no contacts from API, use sample data
  const displayContacts =
    emergencyContacts.length > 0 ? filteredContacts : sampleContacts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2 font-heading">
              <Phone className="h-8 w-8" />
              Emergency Contacts
            </h1>

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
              <button
                onClick={() => setIsHelpVisible(!isHelpVisible)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Get Help
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Emergency Alert */}
        {isHelpVisible && (
          <div>
            <Alert className="mb-8 border-red-500 bg-red-50 animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2">
                If you are experiencing a medical emergency, please dial{" "}
                <span className="font-bold text-red-600">+977 911</span>{" "}
                immediately.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Location Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between">
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
          </div>

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && (
          <Alert className="mb-8 border-red-500 bg-red-50">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <AlertDescription className="ml-2">{error}</AlertDescription>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </Alert>
        )}

        {/* Contacts Grid - Now shows sample data if API fails */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {contact.name}
                </h2>
                <ul className="space-y-3">
                  {contact.numbers &&
                    contact.numbers.map((number, idx) => (
                      <li
                        key={`${contact._id}-${idx}`}
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
            </div>
          ))}
        </div>

        {/* Show fallback message when no contacts are available */}
        {!isLoading && displayContacts.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No emergency contacts found matching your search.
            </p>
          </div>
        )}

        {/* Map with Emergency Services */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapIcon className="h-6 w-6 text-red-500" />
              Nearby Emergency Services
            </h2>
            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Found {nearbyServices.length} services nearby</span>
              </div>
            )}
          </div>

          {!location ? (
            <div className="bg-gray-100 rounded-lg h-96 flex flex-col items-center justify-center">
              <MapIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center mb-2">
                Please share your location to view nearby emergency services
              </p>
              <button
                onClick={getLocation}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 ease-in-out mt-4"
              >
                <Navigation className="h-4 w-4" />
                Share Location
              </button>
            </div>
          ) : (
            <div
              id="emergency-map"
              ref={mapRef}
              className="h-96 rounded-lg border border-gray-200"
            />
          )}

          {/* Legend for map markers */}
          {location && nearbyServices.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs">P</span>
                </div>
                <span className="text-sm">Police</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-xs">H</span>
                </div>
                <span className="text-sm">Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs">F</span>
                </div>
                <span className="text-sm">Fire Department</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs">C</span>
                </div>
                <span className="text-sm">Clinic</span>
              </div>
            </div>
          )}

          {/* List of nearby services */}
          {location && nearbyServices.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Emergency Services List
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                        ${
                          service.type === "hospital"
                            ? "bg-red-600"
                            : service.type === "police"
                            ? "bg-blue-600"
                            : service.type === "fire"
                            ? "bg-orange-600"
                            : "bg-green-600"
                        }`}
                      >
                        <span className="font-bold">
                          {service.type === "hospital"
                            ? "H"
                            : service.type === "police"
                            ? "P"
                            : service.type === "fire"
                            ? "F"
                            : "C"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-500">
                          {service.type.charAt(0).toUpperCase() +
                            service.type.slice(1)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${service.contact}`}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Phone className="h-3 w-3" />
                      Call
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

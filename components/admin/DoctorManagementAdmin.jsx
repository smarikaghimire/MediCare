"use client";
import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash,
  Plus,
  Save,
  X,
  Phone,
  Mail,
  Stethoscope,
  Clock,
} from "lucide-react";

export default function DoctorManagementAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    consultationFee: "",
    experience: "",
    hospital: "",
    location: "",
    availableDays: [],
    imageUrl: "",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Fetch doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/doctors");

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Unable to load doctors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingEmail = async (email) => {
    try {
      const response = await fetch(
        `/api/admin/doctors/check-email?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  };

  const handleAddDoctor = async () => {
    try {
      // Basic validation
      if (!newDoctor.name || !newDoctor.email || !newDoctor.specialization) {
        setError(
          "Please fill in all required fields (name, email, specialization)"
        );
        return;
      }

      // Check if email already exists (with error handling)
      try {
        const emailExists = await checkExistingEmail(newDoctor.email);
        if (emailExists) {
          setError("A doctor with this email already exists");
          return;
        }
      } catch (err) {
        console.error("Email check failed, proceeding with save:", err);
      }

      // Save the doctor to the database
      const response = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add doctor");
      }

      // Reset form and refresh doctors
      setNewDoctor({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        consultationFee: "",
        experience: "",
        hospital: "",
        location: "",
        availableDays: [],
        imageUrl: "",
      });
      setIsAddingNew(false);
      fetchDoctors();
    } catch (err) {
      console.error("Error adding doctor:", err);
      setError("Failed to add doctor. Please try again.");
    }
  };

  // Update doctor
  const handleUpdateDoctor = async () => {
    try {
      const response = await fetch(`/api/admin/doctors/${editingDoctor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingDoctor),
      });

      if (!response.ok) {
        throw new Error("Failed to update doctor");
      }

      setEditingDoctor(null);
      setEditingDoctorId(null);
      fetchDoctors();
    } catch (err) {
      console.error("Error updating doctor:", err);
      setError("Failed to update doctor. Please try again.");
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch(`/api/admin/doctors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      if (editingDoctorId === id) {
        setEditingDoctor(null);
        setEditingDoctorId(null);
      }

      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError("Failed to delete doctor. Please try again.");
    }
  };

  // Handle available days checkbox change
  const handleDaysChange = (day) => {
    if (editingDoctor) {
      const updatedDays = editingDoctor.availableDays.includes(day)
        ? editingDoctor.availableDays.filter((d) => d !== day)
        : [...editingDoctor.availableDays, day];

      setEditingDoctor({
        ...editingDoctor,
        availableDays: updatedDays,
      });
    } else {
      const updatedDays = newDoctor.availableDays.includes(day)
        ? newDoctor.availableDays.filter((d) => d !== day)
        : [...newDoctor.availableDays, day];

      setNewDoctor({
        ...newDoctor,
        availableDays: updatedDays,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor Management
          </h1>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isAddingNew ? <X /> : <Plus />}
            {isAddingNew ? "Cancel" : "Add New Doctor"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add new doctor form */}
        {isAddingNew && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Doctor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Doctor Name</label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="doctor@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={newDoctor.phone}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="+1 123-456-7890"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={newDoctor.specialization}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Cardiology"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={newDoctor.experience}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      experience: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="10"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Consultation Fee ($)
                </label>
                <input
                  type="text"
                  value={newDoctor.consultationFee}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      consultationFee: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Hospital/Clinic
                </label>
                <input
                  type="text"
                  value={newDoctor.hospital}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, hospital: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="City General Hospital"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newDoctor.location}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, location: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newDoctor.imageUrl}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, imageUrl: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/doctor-image.jpg"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Available Days</label>
              <div className="flex flex-wrap gap-3">
                {days.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newDoctor.availableDays.includes(day)}
                      onChange={() => handleDaysChange(day)}
                      className="rounded text-blue-600"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAddDoctor}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Save size={18} /> Save Doctor
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right w-24">
                    Action .
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              doctor.imageUrl ||
                              "https://via.placeholder.com/40"
                            }
                            alt={doctor.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Available: {doctor.availableDays.join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail size={14} />
                          <a
                            href={`mailto:${doctor.email}`}
                            className="text-blue-600 truncate max-w-xs"
                          >
                            {doctor.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          <a
                            href={`tel:${doctor.phone}`}
                            className="text-blue-600"
                          >
                            {doctor.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Stethoscope size={16} className="text-blue-600" />
                          <span className="text-sm font-medium">
                            {doctor.specialization}
                          </span>
                        </div>
                        {doctor.experience && (
                          <div className="text-xs text-gray-500 mt-1">
                            {doctor.experience} years experience
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        ${doctor.consultationFee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingDoctorId(doctor._id);
                            setEditingDoctor({ ...doctor });
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                          title="Edit doctor"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                          title="Delete doctor"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Expanded editing form for additional fields */}
        {editingDoctor && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Edit Additional Details for {editingDoctor.name}
              </h3>
              <button
                onClick={() => handleDeleteDoctor(editingDoctor._id)}
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                title="Delete this doctor"
              >
                <Trash size={18} /> Delete Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editingDoctor.name || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingDoctor.email || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={editingDoctor.phone || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      phone: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={editingDoctor.specialization || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Consultation Fee ($)
                </label>
                <input
                  type="text"
                  value={editingDoctor.consultationFee || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      consultationFee: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={editingDoctor.experience || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      experience: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="10"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={editingDoctor.imageUrl || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/doctor-image.jpg"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Hospital/Clinic
                </label>
                <input
                  type="text"
                  value={editingDoctor.hospital || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      hospital: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="City General Hospital"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editingDoctor.location || ""}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      location: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Available Days</label>
              <div className="flex flex-wrap gap-3">
                {days.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(editingDoctor.availableDays || []).includes(
                        day
                      )}
                      onChange={() => handleDaysChange(day)}
                      className="rounded text-blue-600"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditingDoctor(null);
                  setEditingDoctorId(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleUpdateDoctor}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

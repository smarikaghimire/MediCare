"use client";
import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash,
  Plus,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Phone,
} from "lucide-react";

export default function EmergencyContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    numbers: [{ name: "", number: "" }],
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/emergency-contacts");

      if (!response.ok) {
        throw new Error("Failed to fetch emergency contacts");
      }

      const data = await response.json();
      setContacts(data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching emergency contacts:", err);
      setError("Unable to load emergency contacts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add new contact
  const handleAddContact = async () => {
    try {
      const response = await fetch("/api/emergency-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      // Reset form and refresh contacts
      setNewContact({ name: "", numbers: [{ name: "", number: "" }] });
      setIsAddingNew(false);
      fetchContacts();
    } catch (err) {
      console.error("Error adding contact:", err);
      setError("Failed to add contact. Please try again.");
    }
  };

  // Update contact
  const handleUpdateContact = async () => {
    try {
      const response = await fetch(
        `/api/emergency-contacts/${editingContact._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingContact),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      setEditingContact(null);
      fetchContacts();
    } catch (err) {
      console.error("Error updating contact:", err);
      setError("Failed to update contact. Please try again.");
    }
  };

  // Delete contact
  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/emergency-contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact. Please try again.");
    }
  };

  // Add phone number to contact being edited
  const addPhoneNumber = () => {
    if (editingContact) {
      setEditingContact({
        ...editingContact,
        numbers: [...editingContact.numbers, { name: "", number: "" }],
      });
    } else {
      setNewContact({
        ...newContact,
        numbers: [...newContact.numbers, { name: "", number: "" }],
      });
    }
  };

  // Remove phone number
  const removePhoneNumber = (index) => {
    if (editingContact) {
      const newNumbers = [...editingContact.numbers];
      newNumbers.splice(index, 1);
      setEditingContact({
        ...editingContact,
        numbers: newNumbers,
      });
    } else {
      const newNumbers = [...newContact.numbers];
      newNumbers.splice(index, 1);
      setNewContact({
        ...newContact,
        numbers: newNumbers,
      });
    }
  };

  // Handle phone number change
  const handlePhoneChange = (index, field, value) => {
    if (editingContact) {
      const newNumbers = [...editingContact.numbers];
      newNumbers[index][field] = value;
      setEditingContact({
        ...editingContact,
        numbers: newNumbers,
      });
    } else {
      const newNumbers = [...newContact.numbers];
      newNumbers[index][field] = value;
      setNewContact({
        ...newContact,
        numbers: newNumbers,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Emergency Contacts Admin
          </h1>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isAddingNew ? <X /> : <Plus />}
            {isAddingNew ? "Cancel" : "Add New Contact"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add new contact form */}
        {isAddingNew && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Add New Emergency Contact
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contact Name</label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., Hospital Hotline"
              />
            </div>

            <h3 className="font-medium mb-2">Phone Numbers</h3>
            {newContact.numbers.map((number, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={number.name}
                    onChange={(e) =>
                      handlePhoneChange(index, "name", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Name (e.g., General)"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={number.number}
                    onChange={(e) =>
                      handlePhoneChange(index, "number", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Phone Number"
                  />
                </div>
                <button
                  onClick={() => removePhoneNumber(index)}
                  className="bg-red-50 text-red-600 p-2 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            ))}

            <div className="mt-2 mb-4">
              <button
                onClick={addPhoneNumber}
                className="text-blue-600 flex items-center gap-1"
              >
                <Plus size={16} /> Add Phone Number
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAddContact}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Save size={18} /> Save Contact
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Numbers
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingContact && editingContact._id === contact._id ? (
                        <input
                          type="text"
                          value={editingContact.name}
                          onChange={(e) =>
                            setEditingContact({
                              ...editingContact,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingContact && editingContact._id === contact._id ? (
                        <div className="space-y-2">
                          {editingContact.numbers.map((number, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={number.name}
                                onChange={(e) =>
                                  handlePhoneChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="flex-1 p-1.5 border rounded text-sm"
                                placeholder="Name"
                              />
                              <input
                                type="text"
                                value={number.number}
                                onChange={(e) =>
                                  handlePhoneChange(
                                    index,
                                    "number",
                                    e.target.value
                                  )
                                }
                                className="flex-1 p-1.5 border rounded text-sm"
                                placeholder="Number"
                              />
                              <button
                                onClick={() => removePhoneNumber(index)}
                                className="bg-red-50 text-red-600 p-1 rounded"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={addPhoneNumber}
                            className="text-blue-600 text-sm flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Phone
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {contact.numbers.map((number, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-500 flex items-center gap-1"
                            >
                              <span className="font-medium">
                                {number.name}:
                              </span>
                              <a
                                href={`tel:${number.number}`}
                                className="text-blue-600 flex items-center gap-1"
                              >
                                <Phone size={14} />
                                {number.number}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingContact && editingContact._id === contact._id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleUpdateContact}
                            className="text-green-600 hover:text-green-800 p-1.5 hover:bg-green-50 rounded"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingContact(null)}
                            className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-50 rounded"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingContact({ ...contact })}
                            className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

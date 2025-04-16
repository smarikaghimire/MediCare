"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  AlertTriangle,
  Mail,
  Search,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function ContactFormAdmin() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/contact-submissions");

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        setError("Failed to fetch contact submissions. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching contact submissions:", err);
      setError("Failed to fetch contact submissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state
        setSubmissions(submissions.filter((sub) => sub._id !== id));
      } else {
        setError("Failed to delete submission. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting submission:", err);
      setError("Failed to delete submission. Please try again.");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openMessageModal = (submission) => {
    setModalMessage(submission);
  };

  const closeMessageModal = () => {
    setModalMessage(null);
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredSubmissions = sortedSubmissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      submission.message.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 mr-2" />
        <span className="text-gray-600">Loading submissions...</span>
      </div>
    );
  }

  // Function to get preview text
  const getMessagePreview = (message, maxLength = 60) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Contact Form Submissions
        </h1>
        <button
          onClick={fetchSubmissions}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center p-4 rounded-md bg-red-50 text-red-700 border-l-4 border-red-500">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search submissions..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No submissions found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try adjusting your search term."
                : "Contact form submissions will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sortConfig.key === "name" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email
                    {sortConfig.key === "email" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    Date
                    {sortConfig.key === "createdAt" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => openMessageModal(submission)}
                        className="text-left hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="truncate max-w-xs">
                            {getMessagePreview(submission.message)}
                          </div>
                          <div className="ml-2 text-blue-500">
                            <span className="text-xs font-medium">View</span>
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(submission._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                Message from {modalMessage.name}
              </h3>
              <button
                onClick={closeMessageModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    From:
                  </p>
                  <p className="text-sm font-medium">
                    {modalMessage.name} ({modalMessage.email})
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Date:
                  </p>
                  <p className="text-sm">
                    {new Date(modalMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Message:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md text-sm overflow-auto break-words">
                    <p className="whitespace-pre-wrap overflow-hidden w-full">
                      {modalMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button
                onClick={closeMessageModal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeMessageModal();
                  handleDelete(modalMessage._id);
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 rounded-md text-sm font-medium text-red-600 flex items-center"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

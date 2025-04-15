"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function EmergencyContactForm({
  initialData,
  onSubmit,
  onCancel,
}) {
  const defaultFormData = {
    name: "",
    numbers: [{ name: "", number: "" }],
    order: 100,
    active: true,
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Contact name is required";
    }

    const numberErrors = [];
    let hasValidNumber = false;

    formData.numbers.forEach((num, index) => {
      const numError = {};

      if (!num.name.trim()) {
        numError.name = "Number name is required";
      }

      if (!num.number.trim()) {
        numError.number = "Phone number is required";
      } else {
        hasValidNumber = true;
      }

      if (Object.keys(numError).length > 0) {
        numberErrors[index] = numError;
      }
    });

    if (!hasValidNumber) {
      newErrors.numbers = "At least one valid contact number is required";
    }

    if (numberErrors.length > 0) {
      newErrors.numberErrors = numberErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNumberChange = (index, field, value) => {
    const updatedNumbers = [...formData.numbers];
    updatedNumbers[index][field] = value;
    setFormData({
      ...formData,
      numbers: updatedNumbers,
    });
  };

  const addNumberField = () => {
    setFormData({
      ...formData,
      numbers: [...formData.numbers, { name: "", number: "" }],
    });
  };

  const removeNumberField = (index) => {
    if (formData.numbers.length > 1) {
      const updatedNumbers = [...formData.numbers];
      updatedNumbers.splice(index, 1);
      setFormData({
        ...formData,
        numbers: updatedNumbers,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit" : "Add"} Emergency Contact
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Contact Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter contact name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Contact Numbers *
        </label>
        {errors.numbers && (
          <p className="text-red-500 text-sm mb-2">{errors.numbers}</p>
        )}

        {formData.numbers.map((num, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={num.name}
                onChange={(e) =>
                  handleNumberChange(index, "name", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.numberErrors?.[index]?.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Number name (e.g., Main, Emergency)"
              />
              {errors.numberErrors?.[index]?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numberErrors[index].name}
                </p>
              )}
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={num.number}
                onChange={(e) =>
                  handleNumberChange(index, "number", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.numberErrors?.[index]?.number
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Phone number"
              />
              {errors.numberErrors?.[index]?.number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numberErrors[index].number}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeNumberField(index)}
              disabled={formData.numbers.length <= 1}
              className={`px-3 py-2 rounded-md ${
                formData.numbers.length <= 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              title="Remove number"
            >
              <FaMinus />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addNumberField}
          className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Number
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Display Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="1"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="active"
            id="active"
            checked={formData.active}
            onChange={handleInputChange}
            className="mr-2 h-5 w-5"
          />
          <label htmlFor="active" className="text-gray-700 font-medium">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {initialData ? "Update" : "Add"} Contact
        </button>
      </div>
    </form>
  );
}

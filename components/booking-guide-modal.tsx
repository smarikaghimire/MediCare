"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, User, PhoneCall, Info } from "lucide-react";

interface BookingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingGuideModal({
  isOpen,
  onClose,
}: BookingGuideModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Close the modal on final step
      onClose();
    }
  };

  const handleClose = () => {
    setStep(1); // Reset step when closing
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Blue header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Medicare Appointment Guide</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-blue-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center mt-4 space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index + 1 <= step
                      ? "bg-white text-blue-700"
                      : "bg-blue-400 text-white"
                  } font-bold`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 flex-1 mx-1 ${
                      index + 1 < step ? "bg-white" : "bg-blue-400"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div
          className="p-6 overflow-auto"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-800">
                Welcome to Medicare
              </h3>
              <p className="text-gray-700">
                Medicare provides healthcare coverage for eligible individuals.
                Here's how to use your benefits:
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="flex items-center text-blue-800 font-medium mb-2">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  Medicare Coverage Information
                </h4>
                <p className="text-gray-700">
                  Your Medicare card gives you access to doctor visits, hospital
                  care, and preventive services through our provider network.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-800">
                Doctors & Emergency Services
              </h3>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="flex items-center text-blue-800 font-medium mb-2">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Healthcare Provider Network
                </h4>
                <p className="text-gray-700">
                  Our network includes qualified healthcare providers with
                  various specialties and locations. Book appointments based on
                  your specific healthcare needs.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="flex items-center text-blue-800 font-medium mb-2">
                  <PhoneCall className="w-5 h-5 mr-2 text-blue-600" />
                  Emergency Services
                </h4>
                <p className="text-gray-700">
                  Access emergency contacts and services for urgent medical
                  situations. Important phone numbers are available for
                  immediate assistance.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-800">
                How to Navigate Medicare
              </h3>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
                <p className="text-gray-700">
                  • Access doctors in the Doctors section
                </p>
                <p className="text-gray-700">
                  • Find emergency information in the Emergency section
                </p>
                <p className="text-gray-700">
                  • Click "Find a Doctor" or go directly to the Doctors section
                </p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium text-center">
                  Thank you for choosing Medicare!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="p-6 border-t border-gray-200 bg-white flex justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Close
          </button>
          {step === totalSteps ? (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Okay, got it
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Next
              <ChevronRight className="ml-1 w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

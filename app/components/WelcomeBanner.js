"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { X } from "lucide-react";

const WelcomeBanner = () => {
  const { isLoggedIn, userName } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [hasShownBanner, setHasShownBanner] = useState(false);

  useEffect(() => {
    // Check if we've shown the banner before in this session
    const bannerShown = sessionStorage.getItem("welcomeBannerShown");

    // Only show banner if logged in and haven't shown it in this session
    if (isLoggedIn && !bannerShown && !hasShownBanner) {
      setShowBanner(true);
      // Mark as shown for this session
      sessionStorage.setItem("welcomeBannerShown", "true");
      setHasShownBanner(true);

      // Automatically hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, hasShownBanner]);

  if (!showBanner) return null;

  return (
    <div className="fixed top-20 right-4 md:right-8 z-50 max-w-sm bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-600 animate-slideIn">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg text-slate-800">
            Welcome back{userName.firstName ? `, ${userName.firstName}` : ""}!
          </h3>
          <p className="text-slate-600 mt-1">
            You're now logged in to your MediCare account.
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeBanner;

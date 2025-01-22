import React from "react";
import Link from "next/link";
import { Home, UserCircle2, Phone, Users2, AlertCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="font-sans">MediCare</span>
          </Link>

          {/* Center Navigation Links */}
          <div className="flex items-center justify-center flex-1 max-w-2xl ml-8">
            <nav className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/doctors"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Users2 className="w-5 h-5" />
                <span className="font-medium">Doctors</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Contact</span>
              </Link>
              <Link
                href="/emergency"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Emergency</span>
              </Link>
            </nav>
          </div>

          {/* Enlarged User Button */}
          <Link
            href="/Login"
            className="flex items-center space-x-2 text-base font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-md transition-all duration-200"
          >
            <UserCircle2 className="w-5 h-5" />
            <span>User</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

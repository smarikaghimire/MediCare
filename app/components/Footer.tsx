import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setEmail("");
    // Hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 relative">
      {/* Professional Alert in center with blue theme */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
          <div className="bg-white rounded-lg shadow-xl w-auto max-w-md mx-4 overflow-hidden">
            <div className="bg-blue-500 px-4 py-2 flex justify-between items-center">
              <h3 className="text-white font-medium">Notification</h3>
              <button
                onClick={() => setShowAlert(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-800">
                Thank you for subscribing! This feature is coming soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">MediCare</h3>
            <p className="text-gray-400 leading-relaxed">
              Providing excellence in healthcare services with compassion and
              care for over a decade.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Services
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/doctors">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Doctors
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/doctors">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Appointments
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/emergency">
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    Emergency
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Pokhara, Lakeside Rd</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>065-40-10-23</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>teammedicare777@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-gray-400">
              Stay updated with our latest news and updates.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-center items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} MediCare. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

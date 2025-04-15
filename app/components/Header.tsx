"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  UserCircle2,
  Phone,
  Users2,
  AlertCircle,
  LogOut,
  User,
  Calendar,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Custom user initial icon component
const UserInitialIcon = ({ name }) => {
  const initial = name ? name[0].toUpperCase() : "U";

  return (
    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-medium">
      {initial}
    </div>
  );
};

const Header = () => {
  const { isLoggedIn, logout, userName } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Apply body overflow hidden when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
    setIsMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
          >
            <span className="font-sans">MediCare</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl ml-4 lg:ml-8">
            <nav className="flex items-center space-x-4 lg:space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-1 lg:space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/doctors"
                className="flex items-center space-x-1 lg:space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <Users2 className="w-5 h-5" />
                <span className="font-medium">Doctors</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-1 lg:space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Contact</span>
              </Link>
              <Link
                href="/emergency"
                className="flex items-center space-x-1 lg:space-x-2 text-red-600 hover:text-red-700 transition-colors focus:outline-none"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Emergency</span>
              </Link>
            </nav>
          </div>

          {/* Desktop Login/User Dropdown */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 text-base font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-md transition-all duration-200 focus:outline-none">
                    <UserInitialIcon name={userName?.firstName} />
                    <span>{userName?.firstName || "User"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild className="focus:outline-none">
                    <Link
                      href="/profile"
                      className="flex items-center cursor-pointer focus:outline-none w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:outline-none">
                    <Link
                      href="/appointments"
                      className="flex items-center cursor-pointer focus:outline-none w-full"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-700 cursor-pointer focus:outline-none"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/Login"
                className="flex items-center space-x-2 text-base font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-md transition-all duration-200 focus:outline-none"
              >
                <UserCircle2 className="w-5 h-5" />
                <span>Log in</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center py-3">
              <Link
                href="/"
                className="text-2xl font-bold text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                MediCare
              </Link>
              <button 
                onClick={toggleMenu}
                className="p-2 text-gray-600"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-4 border-t border-gray-100 pt-5">
              <nav className="flex flex-col space-y-5">
                <Link
                  href="/"
                  className="flex items-center py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-6 h-6 mr-4 text-gray-600" />
                  <span className="text-lg">Home</span>
                </Link>
                
                <Link
                  href="/doctors"
                  className="flex items-center py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users2 className="w-6 h-6 mr-4 text-gray-600" />
                  <span className="text-lg">Doctors</span>
                </Link>
                
                <Link
                  href="/contact"
                  className="flex items-center py-3 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="w-6 h-6 mr-4 text-gray-600" />
                  <span className="text-lg">Contact</span>
                </Link>
                
                <Link
                  href="/emergency"
                  className="flex items-center py-3 text-red-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <AlertCircle className="w-6 h-6 mr-4" />
                  <span className="text-lg">Emergency</span>
                </Link>
              </nav>
              
              {/* Divider */}
              <div className="border-t border-gray-100 my-5"></div>
              
              {/* User Account Links */}
              {isLoggedIn ? (
                <nav className="flex flex-col space-y-5">
                  <Link
                    href="/profile"
                    className="flex items-center py-3 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-6 h-6 mr-4 text-gray-600" />
                    <span className="text-lg">My Profile</span>
                  </Link>
                  
                  <Link
                    href="/appointments"
                    className="flex items-center py-3 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="w-6 h-6 mr-4 text-gray-600" />
                    <span className="text-lg">My Appointments</span>
                  </Link>
                  
                  <button
                    className="flex items-center py-3 text-red-600 w-full text-left"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="w-6 h-6 mr-4" />
                    <span className="text-lg">Log out</span>
                  </button>
                </nav>
              ) : (
                <Link
                  href="/Login"
                  className="flex items-center py-3 text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle2 className="w-6 h-6 mr-4" />
                  <span className="text-lg">Log in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white border border-blue-100 max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-900">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-700">
              Are you sure you want to log out of your MediCare account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-blue-200 text-blue-700 focus:outline-none mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
              onClick={confirmLogout}
            >
              Confirm Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
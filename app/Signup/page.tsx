// Add this at the top to mark the component as a client component
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  ClipboardCheck,
  Calendar,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Ensure this import is correct for Next.js 13+

const SignupPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when user types
    if (name === "email" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Send data to your signup API endpoint
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Registration result:", result);

      if (result.success) {
        // Show success dialog instead of redirecting immediately
        setShowSuccessDialog(true);
      } else {
        // Handle failure
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/Login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply animate-float1"></div>
        <div className="absolute right-1/4 top-1/3 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply animate-float2"></div>
        <div className="absolute left-1/3 bottom-1/4 w-36 h-36 bg-sky-100 rounded-full mix-blend-multiply animate-float3"></div>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
        {/* Left Section - Features */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8 space-y-8">
          <div className="relative">
            <HeartPulse className="w-20 h-20 text-blue-600 animate-pulse" />
            <Shield className="w-12 h-12 text-blue-500 absolute -right-4 top-0 animate-bounce" />
            <Calendar className="w-8 h-8 text-blue-400 absolute -left-4 bottom-0 animate-bounce" />
          </div>

          <h1 className="text-4xl font-bold text-slate-800 text-center mt-8">
            Join <span className="text-blue-600">MediCare</span>
            <span className="block text-xl mt-2 font-normal text-slate-600">
              Your Journey to Better Health Starts Here
            </span>
          </h1>

          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Easy Appointments
                  </h3>
                  <p className="text-sm text-slate-600">
                    Book with just a few clicks
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Secure Records
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your data is protected
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Personal Care
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tailored to your needs
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">24/7 Access</h3>
                  <p className="text-sm text-slate-600">Always here for you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 lg:p-12 w-full max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-800 text-center mb-8">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className={`pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="123-456-7890"
                  className="pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className={`pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/Login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-white p-0 overflow-hidden max-w-md">
          <div className="bg-blue-400 p-4 flex justify-center">
            <div className="bg-white rounded-full p-2">
              <Check className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <AlertDialogHeader className="p-6">
            <AlertDialogTitle className="text-2xl text-center font-bold text-slate-800">
              Account Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-600">
              Your MediCare account has been created. You can now log in to
              access all of our healthcare services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="p-6 pt-0">
            <AlertDialogAction asChild>
              <Button
                onClick={handleLoginRedirect}
                className="w-full bg-blue-400 hover:bg-blue-500"
              >
                Proceed to Login
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SignupPage;

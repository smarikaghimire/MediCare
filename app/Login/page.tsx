"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Mail,
  Lock,
  Activity,
  Stethoscope,
  CircleDot,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-1/4 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply animate-blob1"></div>
        <div className="absolute right-1/3 top-1/3 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply animate-blob2"></div>
        <div className="absolute -right-10 bottom-1/4 w-36 h-36 bg-sky-100 rounded-full mix-blend-multiply animate-blob3"></div>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8 space-y-8">
          <div className="relative">
            <Heart className="w-20 h-20 text-blue-600 animate-pulse" />
            <Activity className="w-12 h-12 text-blue-500 absolute -right-4 top-0 animate-bounce" />
            <CircleDot className="w-8 h-8 text-blue-400 absolute -left-4 bottom-0 animate-ping" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 text-center mt-8 font-sans">
            Welcome Back to
            <span className="text-blue-600 block mt-2">MediCare</span>
          </h1>
          <p className="text-slate-600 text-center max-w-md leading-relaxed">
            Your trusted healthcare partner. Login to access your medical
            records, appointments, and personalized care recommendations.
          </p>
          <div className="flex items-center space-x-8 mt-8">
            <div className="flex flex-col items-center">
              <Stethoscope className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm text-slate-600">Expert Care</span>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <User className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm text-slate-600">Personal Dashboard</span>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 lg:p-12 w-full max-w-xl mx-auto relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-slate-800 text-center mt-6 mb-8">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            {/* Remember and Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-slate-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/Signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style jsx global>
        {`
          @keyframes blob1 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(20px, -20px) scale(1.1);
            }
          }
          @keyframes blob2 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(-20px, 20px) scale(1.1);
            }
          }
          @keyframes blob3 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(20px, 20px) scale(1.1);
            }
          }
          .animate-blob1 {
            animation: blob1 7s infinite;
          }
          .animate-blob2 {
            animation: blob2 8s infinite;
          }
          .animate-blob3 {
            animation: blob3 9s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;

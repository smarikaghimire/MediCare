"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  HeartPulse,
  Send,
  Shield,
  Stethoscope,
} from "lucide-react";

const ContactForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <HeartPulse className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6 font-sans">
            How Can We Help You?
          </h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 leading-relaxed font-sans">
            Your health is our priority. Reach out to our dedicated team for
            appointments, inquiries, or any assistance you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Section - Professional Healthcare Content */}
          <div className="space-y-8">
            {/* Animated Healthcare Illustration */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-50 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-50 rounded-full opacity-50 animate-pulse delay-300"></div>

              <Stethoscope className="w-16 h-16 text-blue-600 mx-auto mb-6 animate-bounce" />

              <h2 className="text-2xl font-bold text-slate-800 mb-4 relative">
                Trusted Healthcare Partner
              </h2>

              <div className="space-y-6 relative">
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">15+ Years of Excellence</span>
                </div>

                {/* Quote Section */}
                <blockquote className="text-slate-600 italic border-l-4 border-blue-500 pl-4 my-6">
                  "Dedicated to providing exceptional healthcare services with
                  compassion and expertise."
                </blockquote>

                {/* Key Points */}
                <div className="text-left space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-slate-600">
                      Expert Medical Professionals
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-slate-600">
                      State-of-the-art Facilities
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-slate-600">24/7 Emergency Care</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 h-auto">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <Mail className="w-6 h-6 text-blue-600 mr-3" />
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Full Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you today?"
                    className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-32 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Right Section - Contact Information and Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <Phone className="w-6 h-6 text-blue-600 mr-3" />
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-6 group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      Location
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Lakeside Road, Near Fewa Lake
                      <br />
                      Pokhara 33700, Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                  <Phone className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                    <p className="text-slate-600">+977 9876512345</p>
                    <p className="text-blue-600 font-medium">Emergency: 100</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <p className="text-slate-600">info@medicare.com</p>
                    <p className="text-slate-600">support@medicare.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                  <Clock className="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      Working Hours
                    </h3>
                    <p className="text-slate-600">
                      Monday - Friday: 9:00 AM - 5:00 PM
                    </p>
                    <p className="text-slate-600">
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                    <p className="text-blue-600 font-medium mt-1">
                      24/7 Emergency Services Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.908889862474!2d83.95720731501473!3d28.209929982577617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995951e9cb03fb7%3A0x7f2454efc0562df2!2sLakeside%2C%20Pokhara%2033700!5e0!3m2!1sen!2snp!4v1625647382981!5m2!1sen!2snp"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

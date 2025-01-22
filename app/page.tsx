"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import * as LucideIcons from "lucide-react";

const FloatingIcon = ({ iconName, delay, duration, x, y, size = 8 }) => {
  const Icon = LucideIcons[iconName];
  return Icon ? (
    <div
      className="absolute opacity-20 transform-gpu"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon className={`text-blue-200 w-${size} h-${size}`} />
    </div>
  ) : null;
};

const FloatingText = ({ text, delay, duration, x, y }) => (
  <div
    className="absolute opacity-10 text-blue-200 font-bold transform-gpu"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      animation: `floatText ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    {text}
  </div>
);

const {
  Stethoscope,
  HeartPulse,
  Activity,
  ChevronRight,
  CalendarCheck,
  PhoneCall,
  ChevronLeft,
  UserPlus,
  Brain,
} = LucideIcons;

const useCounterAnimation = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const current = Math.min(Math.floor(end * progress), end);
        setCount(current);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const StatCard = ({ number, label }) => {
  const isNumeric = !isNaN(Number.parseInt(number)) && !number.includes("/");
  const endNumber = isNumeric ? Number.parseInt(number) : number;
  const displayNumber = isNumeric ? useCounterAnimation(endNumber) : number;

  return (
    <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-100">
      <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 font-outfit">
        {isNumeric ? `${displayNumber}+` : displayNumber}
      </h3>
      <p className="text-gray-600 font-medium font-inter">{label}</p>
    </div>
  );
};
const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  useEffect(() => {
    setIsVisible(true);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translateY(0) translateX(0) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) translateX(10px) rotate(5deg);
        }
      }
      @keyframes floatText {
        0%, 100% {
          transform: translateY(0) scale(1);
          opacity: 0.1;
        }
        50% {
          transform: translateY(-30px) scale(1.1);
          opacity: 0.2;
        }
      }
      @keyframes gradientBG {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Enhanced floating icons configuration
  const floatingIcons = [
    { iconName: "Heart", x: 10, y: 20, delay: 0, duration: 4, size: 24 },
    { iconName: "Plus", x: 85, y: 15, delay: 1, duration: 5, size: 20 },
    { iconName: "Pill", x: 75, y: 70, delay: 2, duration: 4.5, size: 24 },
    { iconName: "Activity", x: 15, y: 65, delay: 1.5, duration: 5.5, size: 22 },
    {
      iconName: "Stethoscope",
      x: 45,
      y: 85,
      delay: 0.5,
      duration: 4.8,
      size: 28,
    },
    { iconName: "Brain", x: 80, y: 40, delay: 2.5, duration: 5.2, size: 24 },
    {
      iconName: "HeartPulse",
      x: 20,
      y: 40,
      delay: 1.8,
      duration: 4.2,
      size: 26,
    },
    { iconName: "UserPlus", x: 60, y: 25, delay: 3, duration: 5, size: 22 },
    { iconName: "Syringe", x: 35, y: 60, delay: 2.2, duration: 4.6, size: 24 },
    {
      iconName: "Thermometer",
      x: 70,
      y: 55,
      delay: 1.2,
      duration: 5.3,
      size: 20,
    },
    { iconName: "Dna", x: 90, y: 80, delay: 2.8, duration: 5.1, size: 26 },
    {
      iconName: "Microscope",
      x: 5,
      y: 85,
      delay: 3.2,
      duration: 4.9,
      size: 24,
    },
    {
      iconName: "Clipboard",
      x: 95,
      y: 30,
      delay: 1.6,
      duration: 5.4,
      size: 22,
    },
    { iconName: "FirstAid", x: 25, y: 10, delay: 2.4, duration: 4.7, size: 24 },
    { iconName: "Virus", x: 55, y: 75, delay: 1.9, duration: 5.2, size: 20 },
  ];

  // Enhanced floating texts
  const floatingTexts = [
    { text: "Healthcare Excellence", x: 15, y: 30, delay: 0, duration: 5 },
    { text: "Wellness & Prevention", x: 75, y: 25, delay: 2, duration: 5.5 },
    { text: "Compassionate Care", x: 45, y: 70, delay: 1, duration: 4.5 },
    { text: "Advanced Health", x: 85, y: 60, delay: 3, duration: 5.2 },
    { text: "Medical Innovation", x: 25, y: 80, delay: 1.5, duration: 4.8 },
    { text: "Patient First", x: 65, y: 40, delay: 2.5, duration: 5.3 },
    { text: "Quality Treatment", x: 35, y: 20, delay: 1.8, duration: 4.6 },
    { text: "Expert Care", x: 55, y: 90, delay: 2.2, duration: 5.1 },
  ];

  const services = [
    {
      title: "Primary Care",
      description: "Comprehensive health services for individuals and families",
      icon: <Stethoscope className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Specialized Treatment",
      description: "Expert care from experienced specialists in various fields",
      icon: <HeartPulse className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Emergency Services",
      description: "24/7 emergency care when you need it most",
      icon: <Activity className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Wellness Programs",
      description:
        "Personalized wellness programs to maintain a healthy lifestyle",
      icon: <UserPlus className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Mental Health Support",
      description: "Professional support and therapy for mental well-being",
      icon: <Brain className="w-8 h-8 text-blue-500" />,
    },
  ];

  const stats = [
    { number: "10000", label: "Happy Patients" },
    { number: "100", label: "Medical Experts" },
    { number: "20", label: "Years Experience" },
    { number: "24/7", label: "Support Available" },
  ];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white font-inter">
      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(45deg, #1a365d, #2c5282, #2b6cb0)",
            backgroundSize: "400% 400%",
            animation: "gradientBG 15s ease infinite",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,100,255,0.1),rgba(0,0,0,0.3))]" />

        {floatingIcons.map((icon, index) => (
          <FloatingIcon key={`icon-${index}`} {...icon} />
        ))}

        {floatingTexts.map((text, index) => (
          <FloatingText key={`text-${index}`} {...text} />
        ))}

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 leading-tight font-outfit">
              Your Journey to{" "}
              <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                Better Health
              </span>{" "}
              Starts Here
            </h1>
            <p className="text-xl text-blue-100 mb-8 font-light leading-relaxed">
              Providing exceptional healthcare services with cutting-edge
              technology and compassionate care for your well-being.
            </p>
            <div className="flex gap-6 justify-center">
              <Link
                href="/doctors"
                className="group bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Find a Doctor
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/appointment"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-600"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="container mx-auto px-6 py-8 mt-6 relative z-10">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 transform transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} number={stat.number} label={stat.label} />
          ))}
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-gray-800 mb-16 text-center font-outfit">
          Our Healthcare{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Services
          </span>
        </h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] px-4"
                >
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-blue-50 group hover:-translate-y-1">
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 font-outfit">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      href={`/services/${service.title
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      className="text-blue-600 font-medium hover:text-blue-700 flex items-center group"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      </section>

      {/* Enhanced Call-to-Action Section */}
      {/* Updated Call-to-Action Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 font-outfit">
          Ready to Get{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Started?
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Take the first step towards better health today. Our team of medical
          professionals is here to help you.
        </p>
        <div className="flex justify-center gap-6">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg hover:shadow-xl">
            <CalendarCheck className="w-5 h-5 mr-2" />
            Schedule Visit
          </button>
          <Link
            href="/contact"
            className="bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-300 flex items-center transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <PhoneCall className="w-5 h-5 mr-2" />
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

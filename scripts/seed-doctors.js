// scripts/seed-doctors.js

// Enable both CommonJS and ES Modules support
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config({ path: ".env.local" });

// Define the Doctor schema directly in the script to avoid module system issues
const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  specialty: {
    type: String,
    required: [true, "Please provide a specialty"],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, "Please provide years of experience"],
  },
  image: {
    type: String,
    default: "/default-doctor.jpg",
  },
  hospital: {
    type: String,
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Please provide contact information"],
  },
  availability: [
    {
      day: {
        type: String,
        required: [true, "Day is required for availability"],
      },
      hours: {
        type: String,
        required: [true, "Hours are required for availability"],
      },
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Use a model directly in the script
const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

// Connection URI from your environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in environment variables");
  process.exit(1);
}

// Example doctors data matching your schema
const doctorsData = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: bcrypt.hashSync("password123", 10), // Hashed password
    specialty: "Cardiologist",
    experience: 10,
    image: "/doctors/doctor1.jpg",
    contact: "+1 (555) 123-4567",
    hospital: "Central Medical Center",
    location: "New York",
    availability: [
      { day: "Monday", hours: "09:00-17:00" },
      { day: "Wednesday", hours: "09:00-17:00" },
      { day: "Friday", hours: "09:00-13:00" },
    ],
    isVerified: true,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    password: bcrypt.hashSync("password123", 10),
    specialty: "Neurologist",
    experience: 8,
    image: "/doctors/doctor2.jpg",
    contact: "+1 (555) 234-5678",
    hospital: "University Hospital",
    location: "Boston",
    availability: [
      { day: "Tuesday", hours: "09:00-17:00" },
      { day: "Thursday", hours: "09:00-17:00" },
      { day: "Saturday", hours: "09:00-13:00" },
    ],
    isVerified: true,
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    password: bcrypt.hashSync("password123", 10),
    specialty: "Pediatrician",
    experience: 12,
    image: "/doctors/doctor3.jpg",
    contact: "+1 (555) 345-6789",
    hospital: "Children's Medical Center",
    location: "Chicago",
    availability: [
      { day: "Monday", hours: "10:00-18:00" },
      { day: "Wednesday", hours: "10:00-18:00" },
      { day: "Friday", hours: "10:00-14:00" },
    ],
    isVerified: true,
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    password: bcrypt.hashSync("password123", 10),
    specialty: "Orthopedic Surgeon",
    experience: 15,
    image: "/doctors/doctor4.jpg",
    contact: "+1 (555) 456-7890",
    hospital: "Sports Medicine Institute",
    location: "Los Angeles",
    availability: [
      { day: "Tuesday", hours: "08:00-16:00" },
      { day: "Thursday", hours: "08:00-16:00" },
      { day: "Saturday", hours: "09:00-13:00" },
    ],
    isVerified: true,
  },
  {
    name: "Dr. Aisha Patel",
    email: "aisha.patel@example.com",
    password: bcrypt.hashSync("password123", 10),
    specialty: "Dermatologist",
    experience: 7,
    image: "/doctors/doctor5.jpg",
    contact: "+1 (555) 567-8901",
    hospital: "Skin Care Clinic",
    location: "New York",
    availability: [
      { day: "Monday", hours: "09:00-17:00" },
      { day: "Thursday", hours: "09:00-17:00" },
      { day: "Friday", hours: "09:00-13:00" },
    ],
    isVerified: true,
  },
  {
    name: "Dr. Robert Kim",
    email: "robert.kim@example.com",
    password: bcrypt.hashSync("password123", 10),
    specialty: "Family Medicine",
    experience: 9,
    image: "/doctors/doctor6.jpg",
    contact: "+1 (555) 678-9012",
    hospital: "Community Health Center",
    location: "Chicago",
    availability: [
      { day: "Wednesday", hours: "08:00-16:00" },
      { day: "Thursday", hours: "08:00-16:00" },
      { day: "Saturday", hours: "09:00-13:00" },
    ],
    isVerified: true,
  },
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    console.log(
      "Connection URI:",
      MONGODB_URI.replace(
        /mongodb\+srv:\/\/([^:]+):[^@]+@/,
        "mongodb+srv://$1:****@"
      )
    ); // Hide password if present

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Delete existing doctors
    const deleteResult = await Doctor.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing doctors`);

    // Insert new doctors
    const result = await Doctor.insertMany(doctorsData);
    console.log(`Successfully seeded ${result.length} doctors`);

    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Create placeholder doctor images directory if it doesn't exist
const publicDoctorsDir = path.join(process.cwd(), "public", "doctors");
if (!fs.existsSync(publicDoctorsDir)) {
  fs.mkdirSync(publicDoctorsDir, { recursive: true });
  console.log("Created doctors image directory at:", publicDoctorsDir);
}

// Run the seed function
seedDatabase();

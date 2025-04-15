// scripts/seed-data.js

// Enable both CommonJS and ES Modules support
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });

// Define the EmergencyContact schema directly in the script to avoid module system issues
const NumberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this number"],
    trim: true,
  },
  number: {
    type: String,
    required: [true, "Please provide a contact number"],
    trim: true,
  },
});

const EmergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this contact"],
      trim: true,
    },
    numbers: {
      type: [NumberSchema],
      required: [true, "Please provide at least one contact number"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one contact number is required",
      },
    },
    order: {
      type: Number,
      default: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Use a model directly in the script
const EmergencyContact =
  mongoose.models.EmergencyContact ||
  mongoose.model("EmergencyContact", EmergencyContactSchema);

// Connection URI from your environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in environment variables");
  process.exit(1);
}

// Emergency contacts data
const emergencyContactsData = [
  {
    name: "Emergency Room",
    numbers: [{ name: "General", number: "100" }],
    order: 1,
    active: true,
  },
  {
    name: "Poison Control",
    numbers: [{ name: "National Helpline", number: "061 567893" }],
    order: 2,
    active: true,
  },
  {
    name: "Ambulance Service",
    numbers: [{ name: "Rapid Response", number: "104" }],
    order: 3,
    active: true,
  },
  {
    name: "Police Department",
    numbers: [
      { name: "Emergency", number: "100" },
      { name: "Non-Emergency", number: "01-4261790" },
    ],
    order: 4,
    active: true,
  },
  {
    name: "Fire Department",
    numbers: [{ name: "Emergency", number: "101" }],
    order: 5,
    active: true,
  },
  {
    name: "Child Emergency",
    numbers: [{ name: "Child Helpline", number: "1098" }],
    order: 6,
    active: true,
  },
  {
    name: "Women's Helpline",
    numbers: [{ name: "Crisis Support", number: "1145" }],
    order: 7,
    active: true,
  },
  {
    name: "Food Helpline",
    numbers: [{ name: "Crisis Support", number: "1145" }],
    order: 7,
    active: true,
  },
  {
    name: "Local Government",
    numbers: [{ name: "Crisis Support", number: "1145" }],
    order: 7,
    active: true,
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

    // Delete existing emergency contacts
    const deleteResult = await EmergencyContact.deleteMany({});
    console.log(
      `Cleared ${deleteResult.deletedCount} existing emergency contacts`
    );

    // Insert new emergency contacts
    const result = await EmergencyContact.insertMany(emergencyContactsData);
    console.log(`Successfully seeded ${result.length} emergency contacts`);

    // Verify the seeded data
    const contacts = await EmergencyContact.find({});
    console.log(`Verification: Found ${contacts.length} contacts in database`);

    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

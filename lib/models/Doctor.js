// models/Doctor.js
import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide doctor name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide phone number"],
  },
  specialization: {
    type: String,
    required: [true, "Please provide specialization"],
  },
  hospital: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  experience: {
    type: Number,
    default: 0,
  },
  qualification: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  consultationFee: {
    type: String,
    required: [true, "Please provide consultation fee"],
  },
  availableDays: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

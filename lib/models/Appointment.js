import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Changed from required: true to required: false
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  notes: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: "Main Hospital",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);

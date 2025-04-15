import mongoose from "mongoose";

const EmergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide contact name"],
    trim: true,
  },
  numbers: [
    {
      name: {
        type: String,
        required: [true, "Please provide number name"],
        trim: true,
      },
      number: {
        type: String,
        required: [true, "Please provide phone number"],
        trim: true,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.EmergencyContact ||
  mongoose.model("EmergencyContact", EmergencyContactSchema);

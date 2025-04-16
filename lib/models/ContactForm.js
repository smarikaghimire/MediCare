//lib/models/contactForm.js
import mongoose from "mongoose";

const ContactFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Check if model already exists to prevent overwrite during hot-reloading
const ContactForm =
  mongoose.models.ContactForm ||
  mongoose.model("ContactForm", ContactFormSchema);

export default ContactForm;

// File: app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Appointment from "@/lib/models/Appointment"; // Using the correct model name
import mongoose from "mongoose";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    // Validate status
    if (
      !status ||
      !["pending", "confirmed", "completed", "cancelled"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update appointment
    const result = await Appointment.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: { _id: id, status },
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update appointment status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

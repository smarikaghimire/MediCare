import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Doctor from "@/lib/models/Doctor";
import Appointment from "@/lib/models/Appointment";
import EmergencyContact from "@/lib/models/EmergencyContact";

export async function GET() {
  try {
    await dbConnect();

    // Count doctors
    const doctorCount = await Doctor.countDocuments();

    // Count emergency contacts
    const emergencyCount = await EmergencyContact.countDocuments();

    // Count appointments
    const appointmentCount = await Appointment.countDocuments();

    return NextResponse.json({
      success: true,
      doctorCount,
      emergencyCount,
      appointmentCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch dashboard counts",
      },
      { status: 500 }
    );
  }
}

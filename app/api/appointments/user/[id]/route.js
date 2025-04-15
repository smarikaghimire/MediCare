import dbConnect from "@/lib/database";
import Appointment from "@/lib/models/Appointment";
import User from "@/lib/models/User";
import Doctor from "@/lib/models/Doctor";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Ensure Doctor model is registered before using it
    await Promise.resolve(Doctor);

    // Fix: Await params before accessing properties
    const { id } = await params;
    const userId = id;

    // Verify authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      // Verify the token using jsonwebtoken
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token verification error:", error.message);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Find appointments for this user
    // First try to find by patient field (which is now optional in the schema)
    let appointments = await Appointment.find({
      patient: userId,
    }).populate(
      "doctor",
      "name specialty specialization hospital location consultationFee"
    );

    // If no appointments found by patient ID, try to find by patientName
    if (appointments.length === 0) {
      try {
        // Get user's name from the database to match with patientName
        const user = await User.findById(userId).select("firstName lastName");

        if (user) {
          const fullName = `${user.firstName} ${user.lastName}`.trim();

          // Find appointments by patientName (case-insensitive regex search)
          const nameAppointments = await Appointment.find({
            patientName: { $regex: new RegExp(fullName, "i") },
          }).populate(
            "doctor",
            "name specialty specialization hospital location consultationFee"
          );

          if (nameAppointments.length > 0) {
            appointments = nameAppointments;
          }
        }
      } catch (userError) {
        console.error("Error finding user:", userError);
        // Continue with empty appointments rather than failing
      }
    }

    // Return the appointments (empty array if none found)
    return NextResponse.json(
      {
        success: true,
        appointments,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
        error: error.stack,
      },
      { status: 500 }
    );
  }
}

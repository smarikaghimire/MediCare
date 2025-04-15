import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Doctor from "@/lib/models/Doctor";
import Appointment from "@/lib/models/Appointment";

export async function GET(request) {
  try {
    await dbConnect();

    // Parse URL search params for filtering
    const { searchParams } = new URL(request.url);
    const query = {};

    if (searchParams.has("doctorId")) {
      query.doctor = searchParams.get("doctorId"); // Changed from doctorId to doctor
    }

    if (searchParams.has("status")) {
      query.status = searchParams.get("status");
    }

    // Fetch appointments
    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialty") // Changed from doctorId to doctor
      .lean();

    // Transform appointments for consistent response
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment,
      doctorName: appointment.doctor?.name || "Unknown", // Changed from doctorId to doctor
    }));

    return NextResponse.json({ success: true, data: formattedAppointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointments",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const requestData = await request.json();

    // Accept either doctorId or doctor field
    const doctorId = requestData.doctorId || requestData.doctor;
    const { patientName, contactNumber, appointmentDate, appointmentTime } =
      requestData;

    // Validate required fields
    if (
      !doctorId ||
      !patientName ||
      !contactNumber ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Optional: Check for appointment conflicts
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId, // Changed from doctorId to doctor
      appointmentDate,
      appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Create appointment - Note: patient field is now optional in the schema
    const appointment = new Appointment({
      doctor: doctorId,
      patientName,
      contactNumber,
      appointmentDate,
      appointmentTime,
      status: "pending",
      createdAt: new Date(),
      // No need to provide patient field as it's now optional
    });

    await appointment.save();

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully",
        appointmentId: appointment._id,
        appointment: appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

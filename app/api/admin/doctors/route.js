import dbConnect from "@/lib/database";
import Doctor from "@/lib/models/Doctor";
import { NextResponse } from "next/server";

// GET all doctors
export async function GET() {
  try {
    await dbConnect();
    const doctors = await Doctor.find({}).sort({ name: 1 });

    return NextResponse.json({ success: true, data: doctors }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch doctors",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST a new doctor
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Log the data being received
    console.log("Received doctor data:", data);

    // Explicitly map each field to ensure they're all included
    const newDoctor = await Doctor.create({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      specialization: data.specialization,
      hospital: data.hospital || "",
      location: data.location || "",
      experience: data.experience ? Number(data.experience) : 0,
      consultationFee: data.consultationFee,
      availableDays: data.availableDays || [],
      imageUrl: data.imageUrl || "",
      qualification: data.qualification || "",
      bio: data.bio || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Doctor created successfully",
        data: newDoctor,
      },
      { status: 201 }
    );
  } catch (error) {
    // Log the detailed error
    console.error("Doctor creation error details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create doctor",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

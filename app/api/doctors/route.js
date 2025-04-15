import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Doctor from "@/lib/models/Doctor";

export async function GET() {
  try {
    console.log("🔍 GET /api/doctors - Fetching doctors...");

    // Connect to the database
    await dbConnect();
    console.log("✅ Database connected");

    // Fetch all doctors and ensure consistent field names
    const doctors = await Doctor.find({});
    console.log(`📋 Found ${doctors.length} doctors`);

    // Process doctors to ensure consistent field naming and default values
    const processedDoctors = doctors.map((doc) => {
      const doctorObj = doc.toObject();

      // Ensure consistent specialty field
      if (doctorObj.specialization && !doctorObj.specialty) {
        doctorObj.specialty = doctorObj.specialization;
      } else if (doctorObj.specialty && !doctorObj.specialization) {
        doctorObj.specialization = doctorObj.specialty;
      }

      // Ensure other important fields have default values
      return {
        ...doctorObj,
        hospital: doctorObj.hospital || "Health",
        email: doctorObj.email || "",
        experience: doctorObj.experience || 2,
        phone: doctorObj.phone || "",
        location: doctorObj.location || "",
        consultationFee: doctorObj.consultationFee || 0,
        availableDays: doctorObj.availableDays || [],
        imageUrl: doctorObj.imageUrl || "/default-doctor.jpg",
      };
    });

    // Return success response with processed doctors data
    return NextResponse.json({
      success: true,
      data: processedDoctors,
      count: processedDoctors.length,
    });
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

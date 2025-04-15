import { NextResponse } from "next/server";
import dbConnect from "@/lib/database"; // adjust path as needed
import Doctor from "@/lib/models/Doctor"; // adjust path as needed

export async function GET(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    // Make sure email exists before querying
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email parameter is required",
        },
        { status: 400 }
      );
    }

    const doctor = await Doctor.findOne({ email });

    return NextResponse.json({
      success: true,
      exists: !!doctor,
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

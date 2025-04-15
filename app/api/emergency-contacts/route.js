// app/api/emergency-contacts/route.js
import { NextResponse } from "next/server";
import EmergencyContact from "@/lib/models/EmergencyContact";
import dbConnect from "@/lib/database";

export async function GET() {
  try {
    console.log("🔄 Starting emergency contacts fetch");

    // Connect to database with improved error handling
    await dbConnect();
    console.log("✅ Database connection established");

    // Query contacts with proper error handling
    const contacts = await EmergencyContact.find({ active: true })
      .sort({ order: 1 })
      .lean();
    console.log(`📊 Found ${contacts.length} active contacts`);

    // Return consistent response structure
    return NextResponse.json(
      {
        success: true,
        data: contacts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Emergency contacts fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency contacts: " + error.message,
      },
      { status: 500 }
    );
  }
}

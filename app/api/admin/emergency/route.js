import dbConnect from "@/lib/database";
import EmergencyContact from "@/lib/models/EmergencyContact";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    console.log("Received emergency contact data:", data); // Log the request data

    // Validation for required fields
    if (
      !data.name ||
      !Array.isArray(data.numbers) ||
      typeof data.order !== "number" ||
      typeof data.active !== "boolean"
    ) {
      console.log("Validation failed for contact data:", data);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
        },
        { status: 400 }
      );
    }

    // Create new emergency contact - FIXED: removed the "data" wrapper
    const newContact = await EmergencyContact.create({
      name: data.name,
      numbers: data.numbers,
      order: data.order,
      active: data.active,
    });

    console.log("Contact added successfully:", newContact); // Log the success
    return NextResponse.json(
      {
        success: true,
        message: "Emergency contact added successfully",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in emergency contact route:", error); // Detailed error logging
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add emergency contact",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

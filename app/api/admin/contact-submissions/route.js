import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import ContactForm from "@/lib/models/ContactForm";

export async function GET() {
  try {
    await dbConnect();

    const submissions = await ContactForm.find({})
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch contact submissions",
      },
      { status: 500 }
    );
  }
}

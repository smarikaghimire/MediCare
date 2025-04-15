import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import EmergencyContact from "@/lib/models/EmergencyContact";

// Handle GET requests to /api/emergency-contacts/[id]
export async function GET(request, { params }) {
  const id = params.id;

  try {
    await dbConnect();

    const contact = await EmergencyContact.findById(id);
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// Handle PUT requests to /api/emergency-contacts/[id]
export async function PUT(request, { params }) {
  const id = params.id;

  try {
    await dbConnect();

    const body = await request.json();
    const contact = await EmergencyContact.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// Handle DELETE requests to /api/emergency-contacts/[id]
export async function DELETE(request, { params }) {
  const id = params.id;

  try {
    await dbConnect();

    const deletedContact = await EmergencyContact.findByIdAndDelete(id);
    if (!deletedContact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

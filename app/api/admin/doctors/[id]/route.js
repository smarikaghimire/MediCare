import dbConnect from "@/lib/database";
import Doctor from "@/lib/models/Doctor";
import { NextResponse } from "next/server";

// GET a specific doctor
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch doctor",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE a doctor
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await request.json();

    // Explicitly map each field to ensure they're all included in the update
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
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
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Doctor updated successfully",
        data: updatedDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update doctor",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE a doctor
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete doctor",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

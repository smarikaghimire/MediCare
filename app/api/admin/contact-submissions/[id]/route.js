import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import ContactForm from "@/lib/models/ContactForm";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const result = await ContactForm.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete contact submission",
      },
      { status: 500 }
    );
  }
}

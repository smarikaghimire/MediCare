import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Doctor from "@/lib/models/Doctor";
import User from "@/lib/models/User";
import sendEmail from "@/lib/sendEmail";

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    const {
      doctorId,
      patientName,
      contactNumber,
      appointmentDate,
      appointmentTime,
      patientEmail, // This is coming from the frontend
    } = data;

    if (!doctorId || !patientName || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get doctor details to find their email
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.email) {
      return NextResponse.json(
        { success: false, message: "Doctor not found or doctor has no email" },
        { status: 404 }
      );
    }

    // Try to find patient email if not provided directly
    let finalPatientEmail = patientEmail;

    if (!finalPatientEmail) {
      // Try to find user by name (first part of name might be first name)
      const firstName = patientName.split(" ")[0];
      try {
        const user = await User.findOne({
          $or: [
            { firstName: { $regex: new RegExp(firstName, "i") } },
            { phoneNumber: contactNumber },
          ],
        });

        if (user && user.email) {
          finalPatientEmail = user.email;
          console.log(`Found user email from database: ${finalPatientEmail}`);
        }
      } catch (err) {
        console.error("Error looking up user:", err);
      }
    }

    // Format date for email
    const formattedDate = new Date(appointmentDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Format time for email
    const formattedTime = appointmentTime.includes(":")
      ? appointmentTime
      : `${appointmentTime}:00`;

    // Email to doctor
    const doctorEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">New Appointment Booking</h2>
        <p>Dear ${doctor.name},</p>
        <p>A new appointment has been booked with you. Here are the details:</p>
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Patient Name:</strong> ${patientName}</p>
          <p><strong>Contact Number:</strong> ${contactNumber}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
        </div>
        <p>Please contact admin to reschedule or cancel this appointment.</p>
        <p>Thank you,<br>MediCare </p>
      </div>
    `;

    // Email to patient
    const patientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">Appointment Confirmation</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been booked successfully. Here are the details:</p>
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Doctor:</strong> ${doctor.name}</p>
          <p><strong>Specialty:</strong> ${
            doctor.specialty || doctor.specialization || "Specialist"
          }</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Location:</strong> ${
            doctor.location || "Hospital Location"
          }</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled appointment time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Thank you for choosing MediCare,<br>MediCare Appointment System</p>
      </div>
    `;

    // For development/testing, log the email content but don't expose to client
    console.log("Attempting to send email to doctor:", doctor.email);

    try {
      // Send email to doctor
      await sendEmail({
        to: doctor.email,
        subject: `New Appointment: ${patientName} on ${formattedDate}`,
        text: `New appointment booked with ${patientName} on ${formattedDate} at ${formattedTime}`,
        html: doctorEmailHtml,
      });

      // Send email to patient if patient email is provided or found
      if (finalPatientEmail) {
        console.log("Attempting to send email to patient:", finalPatientEmail);

        await sendEmail({
          to: finalPatientEmail,
          subject: `Your Appointment with Dr. ${doctor.name}`,
          text: `Your appointment with Dr. ${doctor.name} is confirmed for ${formattedDate} at ${formattedTime}`,
          html: patientEmailHtml,
        });

        return NextResponse.json({
          success: true,
          message: "Appointment booked successfully",
        });
      } else {
        console.log("No patient email found, skipping patient notification");

        return NextResponse.json({
          success: true,
          message: "Appointment booked successfully",
        });
      }
    } catch (emailError) {
      console.error("Email sending error details:", emailError);

      // Still return success even if email fails, just log the error
      return NextResponse.json({
        success: true,
        message: "Appointment booked successfully",
      });
    }
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to book appointment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

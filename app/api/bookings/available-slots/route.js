import { NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import Appointment from "@/lib/models/Appointment"
import Doctor from "@/lib/models/Doctor"

export async function GET(request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    // Validate required parameters
    if (!doctorId) {
      return NextResponse.json({ success: false, message: "Doctor ID is required" }, { status: 400 })
    }

    // Get doctor to check available days
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    // Define all possible time slots
    const allTimeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]

    // If date is provided, check booked slots for that date
    if (date) {
      // Convert date string to Date object for MongoDB query
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      try {
        // Find all appointments for this doctor on the specified date
        const bookedAppointments = await Appointment.find({
          doctor: doctorId,
          appointmentDate: { $gte: startDate, $lte: endDate },
          status: { $ne: "cancelled" }, // Exclude cancelled appointments
        })

        // Extract booked time slots
        const bookedTimeSlots = bookedAppointments.map((appointment) => appointment.appointmentTime)

        // Filter out booked slots
        const availableTimeSlots = allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot))

        return NextResponse.json({
          success: true,
          data: {
            availableTimeSlots,
            bookedTimeSlots,
          },
        })
      } catch (error) {
        console.error("Error querying appointments:", error)
        // If there's an error querying appointments, return all time slots as a fallback
        return NextResponse.json({
          success: true,
          data: {
            availableTimeSlots: allTimeSlots,
            bookedTimeSlots: [],
          },
        })
      }
    }

    // If no date provided, just return all time slots and the doctor's available days
    return NextResponse.json({
      success: true,
      data: {
        availableDays: doctor.availableDays || [],
        availableTimeSlots: allTimeSlots, // Return all time slots if no date specified
      },
    })
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch available slots",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

import dbConnect from "../../../../lib/database"; // Path to your database connection
import User from "../../../../lib/models/User"; // Correct path
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// In your signup API route (app/api/auth/signup/route.js), modify it to:
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 }
      );
    }

    // Create user - DON'T hash the password here, let the pre-save hook do it
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      password: data.password, // Pass the plain password, the hook will hash it
    });

    // Remove password from the returned object
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

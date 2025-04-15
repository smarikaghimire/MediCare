import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/database";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export async function POST(req) {
  try {
    // First, connect to the database
    await dbConnect();

    const { email, password } = await req.json();
    console.log("Login attempt with email:", email);

    // Find the user by email, ensure email is lowercase
    const user = await User.findOne({ email: email.toLowerCase() });

    // Enhanced debugging
    if (!user) {
      console.log("User not found with this email:", email.toLowerCase());
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("User found:", {
      email: user.email,
      passwordHash: user.password.substring(0, 10) + "...", // Just show beginning for security
      userId: user._id.toString(),
    });

    console.log("Attempting to compare:", {
      enteredPasswordLength: password.length,
    });

    // Compare the provided password with the stored hash using the matchPassword method
    const isMatch = await user.matchPassword(password);

    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log("Password doesn't match");
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // If we get here, password is correct
    console.log("Login successful for user:", user.email);

    // Generate JWT token
    const token = generateToken(user._id);

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set the token as an HTTP-only cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}

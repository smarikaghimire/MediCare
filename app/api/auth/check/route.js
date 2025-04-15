import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/database";
import User from "@/lib/models/User";

export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("token")?.value;

    // If no token, return not authenticated
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Connect to database
      await dbConnect();

      // Get user data (excluding password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return NextResponse.json({ authenticated: false });
      }

      // Return authenticated status and user data
      return NextResponse.json(
        {
          authenticated: true,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            role: user.role,
          },
        },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Surrogate-Control": "no-store",
          },
        }
      );
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

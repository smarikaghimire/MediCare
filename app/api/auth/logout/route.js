import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json({ success: true });

  // Clear the token cookie
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response;
}

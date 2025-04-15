import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// List of paths that require authentication
const protectedPaths = [
  "/doctors",
  "/appointments",
  "/dashboard",
  "/profile", // Add profile to protected paths
  // Add any other protected routes here
];

// List of paths that are public (no auth needed)
const publicPaths = [
  "/",
  "/login",
  "/Login",
  "/signup",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/signup",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith("/api/auth/") ||
      pathname.startsWith("/_next/")
  );

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // If the path is not protected, allow access
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;

  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  try {
    // Verify the token using jsonwebtoken
    jwt.verify(token, process.env.JWT_SECRET);

    // Token is valid, continue
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    // Clear the invalid token cookie
    const response = NextResponse.redirect(new URL("/Login", request.url));
    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

import type React from "react";
import "../globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../../lib/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediCare Admin",
  description: "Admin dashboard for MediCare platform",
};

// This makes it a root layout that doesn't inherit from app/layout.tsx
export const layoutSegments = [];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

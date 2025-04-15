import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/hooks/useAuth";
import ConditionalLayout from "./components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediCare",
  description: "Professional healthcare management platform",
  icons: {
    icon: "/images/DALL·E_2025_01_22_15_49_43_A_very_simple_and_minimalist_favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

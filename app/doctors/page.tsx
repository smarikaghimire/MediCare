// app/doctors/page.tsx
import { Metadata } from "next";
import DoctorsDirectoryWrapper from "./doctors-directory-wrapper";

export const metadata: Metadata = {
  title: "Find a Doctor | Medicare Health",
  description:
    "Search our directory of expert healthcare professionals by specialty, location, and availability. Book appointments online with our qualified doctors.",
  keywords:
    "doctors, medical professionals, healthcare specialists, book appointment, doctor directory",
  openGraph: {
    title: "Find a Doctor | Healthcare Medical Center",
    description:
      "Connect with expert healthcare professionals at our medical center. Easy online appointment booking available.",
    type: "website",
    images: [
      {
        url: "/images/og-doctors.jpg",
        width: 1200,
        height: 630,
        alt: "Healthcare Medical Center Doctors",
      },
    ],
  },
  alternates: {
    canonical: "https://your-domain.com/doctors",
  },
};

export default function DoctorsPage() {
  return (
    <>
      {/* Add structured data for medical organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "Healthcare Medical Center",
            url: "https://your-domain.com",
            logo: "https://your-domain.com/logo.png",
            medicalSpecialty: [
              "Primary Care",
              "Cardiology",
              "Neurology",
              "Pediatrics",
              "Orthopedics",
            ],
            department: {
              "@type": "MedicalClinic",
              name: "Doctor Directory",
              description:
                "Find specialized healthcare professionals for your medical needs",
              availableService: {
                "@type": "MedicalProcedure",
                name: "Doctor Consultation",
              },
            },
          }),
        }}
      />
      <DoctorsDirectoryWrapper />
    </>
  );
}

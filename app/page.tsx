import { Metadata } from "next";
import HomeClient from "./home-client"; // We'll rename your current Home component file

export const metadata: Metadata = {
  title: "MediCare - Journey to Better Health ",
  description:
    "MediCare provides exceptional healthcare services with cutting-edge technology and compassionate care. Book appointments, find doctors, and access emergency services.",
  keywords: [
    "healthcare",
    "medical appointments",
    "find doctor",
    "medical services",
    "healthcare excellence",
    "patient care",
  ],
  alternates: {
    canonical: "https://your-domain.com",
  },
};

// Add structured data for LocalBusiness (hospital/medical organization)
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "MediCare",
            url: "https://your-domain.com",
            logo: "https://your-domain.com/images/medicare-logo.png",
            description:
              "Providing exceptional healthcare services with cutting-edge technology and compassionate care for your well-being.",
            telephone: "+1-800-MEDICARE",
            email: "contact@medicare-example.com",
            medicalSpecialty: [
              "Primary Care",
              "Specialized Treatment",
              "Emergency Services",
              "Wellness Programs",
              "Mental Health Support",
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Healthcare Avenue",
              addressLocality: "Medical City",
              addressRegion: "MC",
              postalCode: "10001",
              addressCountry: "US",
            },
            openingHours: "Mo,Tu,We,Th,Fr 08:00-20:00 Sa,Su 10:00-16:00",
          }),
        }}
      />
      <HomeClient />
    </>
  );
}

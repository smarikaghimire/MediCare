import { Metadata } from "next";
import ContactFormWrapper from "./ContactFormWrapper";

export const metadata: Metadata = {
  title: "Contact Us | Medicare Health",
  description:
    "Reach out to our dedicated healthcare team for appointments, inquiries, or any assistance you need. Your health is our priority.",
  keywords:
    "healthcare contact, medical assistance, healthcare inquiry, doctor appointment, medical center contact",
  openGraph: {
    title: "Contact Medicare Healthcare Services",
    description:
      "Get in touch with our medical professionals for appointments, inquiries or emergency assistance.",
    images: ["/images/contact-banner.jpg"],
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactFormWrapper />;
}

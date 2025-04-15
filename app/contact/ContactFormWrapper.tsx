"use client";

import dynamic from "next/dynamic";

// Dynamically import the ContactForm component with no SSR
const ContactForm = dynamic(() => import("./ContactForm"), { ssr: false });

export default function ContactFormWrapper() {
  return <ContactForm />;
}

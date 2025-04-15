// app/admin/emergency-contacts/page.jsx
"use client";

import { Suspense } from "react";
import EmergencyContactAdmin from "@/components/admin/EmergencyContactsAdmin";
import { Toaster } from "react-hot-toast";

export default function EmergencyContactsPage() {
  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        <EmergencyContactAdmin />
      </Suspense>
    </div>
  );
}

// app/admin/emergency-contacts/layout.jsx
export default function EmergencyContactsLayout({ children }) {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Emergency Contacts Management</h1>
      {children}
    </div>
  );
}

"use client";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
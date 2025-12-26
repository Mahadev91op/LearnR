"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import StudentClassroomSidebar from "@/components/classroom/StudentClassroomSidebar";
import StudentClassroomContent from "@/components/classroom/StudentClassroomContent";
import { Loader2, AlertTriangle } from "lucide-react";

export default function StudentClassroomPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null); // New State for Student
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;

    const initData = async () => {
      try {
        setLoading(true);
        
        // 1. Get Course Data
        const courseRes = await fetch(`/api/admin/courses/${id}`); 
        if (!courseRes.ok) throw new Error("Course not found");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // 2. Get Current Student Info (For Name in Chat)
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
            const userData = await userRes.json();
            setStudent(userData.user);
        }

      } catch (err) {
        setError("Unable to load classroom. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center text-white">
         <Loader2 className="h-10 w-10 text-yellow-400 animate-spin mb-4" />
         <p className="text-gray-500 font-mono text-xs animate-pulse">ENTERING CLASSROOM...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center text-white p-4 text-center">
         <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
         <p className="text-gray-400 mb-6">{error}</p>
         <button onClick={() => router.push("/dashboard/classroom")} className="px-6 py-2 bg-white text-black font-bold rounded-full">Back</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#050505] z-[100] overflow-hidden flex flex-col md:flex-row">
       <StudentClassroomSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          courseTitle={course?.title} 
       />

       <div className="flex-1 relative h-full overflow-y-auto scroll-smooth md:ml-64 pt-14 pb-20 md:py-0 md:pb-0">
          {/* Pass studentName to content */}
          <StudentClassroomContent 
            activeTab={activeTab} 
            courseData={course} 
            studentName={student?.name} 
          />
       </div>
    </div>
  );
}
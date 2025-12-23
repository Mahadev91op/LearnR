"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Router add kiya redirect ke liye
import { PlayCircle, Clock, BookOpen, Trophy, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state add kiya
  const router = useRouter();

  // Live Update Logic
  useEffect(() => {
    fetchEnrollments();

    const interval = setInterval(() => {
      fetchEnrollments(true); 
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchEnrollments = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const timestamp = Date.now();
      
      // API call
      const res = await fetch(`/api/user/enrollments?t=${timestamp}`, { 
          cache: "no-store",
          headers: { 
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
      });
      
      // FIX: Agar User Logged In nahi hai (401 Error), to Login par bhejein
      if (res.status === 401) {
        console.log("Session expired, redirecting to login...");
        router.push("/login"); 
        return;
      }

      // FIX: Agar koi aur Server Error (500) hai to detail dekhein
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      
      // Duplicate Filtering Logic
      const rawList = data.enrollments || [];
      const uniqueList = [];
      const map = new Map();
      
      for (const item of rawList) {
          if(!item.course) continue;
          if(!map.has(item.course._id)){
              map.set(item.course._id, true);
              uniqueList.push(item);
          }
      }

      setEnrollments(uniqueList);
      setError(null); // Success hone par error hatayein

    } catch (err) {
      console.error("Failed to load courses:", err);
      // Agar background fetch fail ho to user ko pareshan na karein
      if (!isBackground) {
        setError(err.message); 
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (error && loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-400">
           <AlertCircle size={48} className="mb-4 text-red-500" />
           <p className="text-xl text-white">Something went wrong.</p>
           <p className="text-sm mt-2 text-red-400">{error}</p>
           <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
              Try Again
           </button>
        </div>
     )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {getGreeting()}, <span className="text-yellow-400">Student</span>
          </h1>
          <p className="text-gray-400">Ready to continue your learning journey?</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
           <div className="bg-[#111] border border-white/10 px-5 py-3 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase font-bold">Enrolled</p>
              <p className="text-2xl font-bold text-white">{enrollments.length}</p>
           </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="text-yellow-400" size={20} />
          My Courses
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-[#111] animate-pulse rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/10 border-dashed">
            <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white">No courses found</h3>
            <p className="text-gray-400 mt-2 mb-6">It looks like you haven't enrolled yet or approval is pending.</p>
            <Link href="/courses">
              <button className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-all">
                Browse Courses
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => {
              const course = enrollment.course;
              if (!course) return null;

              return (
                <motion.div
                  key={enrollment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(250,204,21,0.15)] flex flex-col h-full"
                >
                   {/* Status Badge */}
                   {enrollment.status === 'pending' && (
                      <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                          Approval Pending
                      </div>
                   )}

                  {/* Gradient Background */}
                  <div className={`h-32 w-full ${course.gradient || 'bg-gradient-to-br from-blue-600 to-purple-600'} relative p-6`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                    <span className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                      {course.category || 'General'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle size={14} /> Online
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-auto space-y-2">
                       <div className="flex justify-between text-xs font-medium">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-yellow-400">0%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 w-0 group-hover:w-[5%] transition-all duration-1000"></div>
                       </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/dashboard/courses/${course._id}`} className="mt-6 block">
                      <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                        <PlayCircle size={18} />
                        Continue Learning
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, Clock, BookOpen, Trophy } from "lucide-react";

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX: Live Update Logic (Polling)
  useEffect(() => {
    // Pehli baar data layein
    fetchEnrollments();

    // Har 5 second mein data refresh karein (Live Update)
    const interval = setInterval(() => {
      fetchEnrollments(true); // 'true' means background update (loading spinner mat dikhao)
    }, 5000);

    // Cleanup (Jab user page se hat jaye to band kardo)
    return () => clearInterval(interval);
  }, []);

  const fetchEnrollments = async (isBackground = false) => {
    try {
      // Background updates me loading mat dikhao taaki flicker na ho
      if (!isBackground) setLoading(true);

      // FIX: 'no-store' se browser cache ignore karega
      const res = await fetch("/api/user/enrollments", { cache: "no-store" });
      const data = await res.json();
      
      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error("Failed to load courses", error);
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
            <h3 className="text-xl font-bold text-white">No courses yet</h3>
            <p className="text-gray-400 mt-2 mb-6">Explore our catalog and start learning today.</p>
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
              
              // Safety Check
              if (!course) return null;

              return (
                <motion.div
                  key={enrollment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(250,204,21,0.15)] flex flex-col h-full"
                >
                  {/* Decorative Gradient Background */}
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

                    {/* Progress Bar (Visual Only) */}
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
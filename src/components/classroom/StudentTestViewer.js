"use client";
import { useState, useEffect, useMemo } from "react";
// FIX: FileText added to imports
import { Search, Calendar, Clock, AlertCircle, PlayCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StudentTestViewer({ courseId }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/tests`);
        const data = await res.json();
        if (data.success) {
          setTests(data.tests);
        }
      } catch (error) {
        toast.error("Failed to load tests");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchTests();
  }, [courseId]);

  // Search Logic & Sorting
  const filteredTests = useMemo(() => {
    let data = tests || [];
    
    // Search Filter
    if (searchQuery) {
      data = data.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort: Upcoming exams first, then past exams
    return data.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  }, [tests, searchQuery]);

  // Identify the "Next" or "Featured" exam
  const now = new Date();
  const featuredTest = filteredTests.find(t => new Date(t.scheduledAt) > now) || filteredTests[filteredTests.length - 1];
  const otherTests = filteredTests.filter(t => t._id !== featuredTest?._id);

  if (loading) return <div className="p-10 text-center text-yellow-400 animate-pulse">Loading Exams...</div>;

  return (
    // Mobile: p-4, Desktop: p-8 (Tight padding on mobile for app feel)
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen pb-20 md:pb-10">
      
      {/* 1. Header & Search Box */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter">
          Exams Zone
        </h2>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-[#0a0a0a] rounded-lg p-1">
            <Search className="text-gray-400 ml-3" size={20} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // Mobile: py-3 for better touch target
              className="w-full bg-transparent border-none outline-none text-white px-3 py-3 md:py-2 placeholder-gray-600 text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No exams found matching your criteria.</div>
      ) : (
        <div className="space-y-8 md:space-y-12">
          
          {/* 2. FEATURED CARD (Latest/Upcoming Exam) */}
          {featuredTest && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group cursor-pointer"
              onClick={() => router.push(`/dashboard/classroom/${courseId}/tests/${featuredTest._id}`)}
            >
              {/* Neon Glow Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              
              {/* Mobile: p-5, Desktop: p-10 */}
              <div className="relative bg-[#111] border border-white/10 p-5 md:p-10 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Clock size={100} className="text-white md:w-[150px] md:h-[150px]" />
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div>
                    <div className="inline-block px-3 py-1 mb-3 md:mb-4 rounded-full bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                      Next Up / Featured
                    </div>
                    {/* Responsive Text Size */}
                    <h1 className="text-2xl md:text-5xl font-black text-white mb-2 leading-tight">
                      {featuredTest.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 line-clamp-2 mb-4 md:mb-6">
                      {featuredTest.description || "No description provided for this exam."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-300">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <Calendar size={14} className="text-blue-400"/> 
                        {new Date(featuredTest.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <Clock size={14} className="text-green-400"/> 
                        {featuredTest.duration}m
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <AlertCircle size={14} className="text-purple-400"/> 
                        {featuredTest.totalMarks} Mks
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-end mt-2 md:mt-0">
                     {/* Mobile: w-full button for app feel */}
                     <button className="w-full md:w-auto bg-white text-black font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl hover:scale-105 active:scale-95 hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center gap-3 text-sm md:text-base">
                        <PlayCircle size={20} />
                        {new Date(featuredTest.scheduledAt) > new Date() ? "View Details" : "Start Now"}
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. GRID FOR OTHER EXAMS */}
          {otherTests.length > 0 && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest border-l-4 border-yellow-400 pl-4">
                All Exams
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {otherTests.map((test, index) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => router.push(`/dashboard/classroom/${courseId}/tests/${test._id}`)}
                    className="group relative bg-[#0f0f0f] border border-white/5 hover:border-white/20 p-5 md:p-6 rounded-xl cursor-pointer hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 active:scale-95"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="bg-white/5 p-2 md:p-3 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded border ${
                        test.status === 'completed' ? 'border-green-500 text-green-500' : 'border-gray-600 text-gray-500'
                      }`}>
                        {test.status || 'Scheduled'}
                      </span>
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {test.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3 md:mb-4">
                      {new Date(test.scheduledAt).toDateString()}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3 md:pt-4 mt-2">
                       <span className="flex items-center gap-1"><Clock size={12}/> {test.duration} min</span>
                       <span>{test.totalMarks} marks</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
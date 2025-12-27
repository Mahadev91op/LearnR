"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, Clock, AlertCircle, PlayCircle, FileText, Trophy, Lock } from "lucide-react";
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

  // Helper: Status Checker
  const getExamStatus = (test) => {
    const now = new Date();
    const start = new Date(test.scheduledAt);
    const end = new Date(start.getTime() + 12 * 60 * 60 * 1000); // 12 hours window

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    return "ENDED";
  };

  // 1. Featured Logic
  const featuredTest = useMemo(() => {
    if (!tests || tests.length === 0) return null;

    const live = tests.find(t => getExamStatus(t) === "LIVE");
    if (live) return { ...live, label: "Live Now", status: "LIVE" };

    // अगर Live नहीं है, तो Upcoming (Next) दिखाओ
    // Upcoming में उसे चुनो जो सबसे पास है (Sort by date ascending)
    const upcoming = tests
      .filter(t => getExamStatus(t) === "UPCOMING")
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
    
    if (upcoming) return { ...upcoming, label: "Upcoming Exam", status: "UPCOMING" };

    // अगर Live और Upcoming भी नहीं है, तो Recently Ended दिखाओ
    const ended = tests
      .filter(t => getExamStatus(t) === "ENDED")
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt))[0]; // Descending date
    
    if (ended) return { ...ended, label: "Just Completed", status: "ENDED" };

    return null;
  }, [tests]);

  // 2. Click Handler Logic
  const handleCardClick = (test) => {
    const status = getExamStatus(test);

    if (status === "UPCOMING") {
      toast("This exam has not started yet.", { icon: "🔒" });
      return; // UNCLICKABLE
    }

    if (status === "LIVE") {
      if (window.confirm(`Start Exam: ${test.title}?\n\nRules: Fullscreen mandatory. Auto-submit on tab switch.`)) {
        router.push(`/portal/exam/${test._id}`);
      }
    }

    if (status === "ENDED") {
      router.push(`/dashboard/classroom/${courseId}/tests/${test._id}/leaderboard`);
    }
  };


  const filteredTests = useMemo(() => {
    let data = tests || [];
    if (searchQuery) {
      data = data.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Sort: Live -> Upcoming -> Ended
    return data.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  }, [tests, searchQuery]);

  const otherTests = filteredTests.filter(t => t._id !== featuredTest?._id);

  if (loading) return <div className="p-10 text-center text-yellow-400 animate-pulse">Loading Exams...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen pb-20 md:pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-tighter">
          Exams Zone
        </h2>
        <div className="relative w-full md:w-96 bg-[#0a0a0a] rounded-lg p-1 border border-white/10">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white pl-10 pr-3 py-2 placeholder-gray-600"
            />
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No exams found.</div>
      ) : (
        <div className="space-y-8 md:space-y-12">
          
          {/* FEATURED BIG CARD */}
          {featuredTest && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative group ${featuredTest.status === 'UPCOMING' ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
              onClick={() => handleCardClick(featuredTest)}
            >
              <div className={`absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500 bg-gradient-to-r ${
                featuredTest.status === 'LIVE' ? 'from-green-500 to-emerald-600' :
                featuredTest.status === 'UPCOMING' ? 'from-blue-500 to-cyan-600' :
                'from-gray-500 to-gray-700'
              }`}></div>
              
              <div className="relative bg-[#111] border border-white/10 p-5 md:p-10 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  {featuredTest.status === 'LIVE' ? <Clock size={150} /> : <Calendar size={150} />}
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border text-xs font-bold uppercase tracking-wider ${
                      featuredTest.status === 'LIVE' ? 'bg-green-500/10 border-green-500 text-green-400 animate-pulse' :
                      featuredTest.status === 'UPCOMING' ? 'bg-blue-500/10 border-blue-500 text-blue-400' :
                      'bg-gray-500/10 border-gray-500 text-gray-400'
                    }`}>
                      {featuredTest.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>}
                      {featuredTest.label}
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                      {featuredTest.title}
                    </h1>
                    <p className="text-gray-400 line-clamp-2 mb-6">
                      {featuredTest.description || "No description provided."}
                    </p>
                    
                    <div className="flex gap-4 text-sm font-medium text-gray-300">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                        <Calendar size={14} className="text-blue-400"/> 
                        {new Date(featuredTest.scheduledAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                        <Clock size={14} className="text-green-400"/> 
                        {featuredTest.duration}m
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                        <AlertCircle size={14} className="text-purple-400"/> 
                        {featuredTest.totalMarks} Mks
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-end">
                     <button className={`w-full md:w-auto font-bold px-8 py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all ${
                       featuredTest.status === 'LIVE' ? 'bg-green-500 hover:bg-green-400 text-black hover:scale-105' :
                       featuredTest.status === 'UPCOMING' ? 'bg-gray-800 text-gray-400 cursor-not-allowed' :
                       'bg-white text-black hover:bg-gray-200 hover:scale-105'
                     }`}>
                        {featuredTest.status === 'LIVE' ? <><PlayCircle size={20}/> Start Now</> : 
                         featuredTest.status === 'UPCOMING' ? <><Lock size={20}/> Locked</> : 
                         <><Trophy size={20}/> View Ranking</>}
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* GRID FOR OTHER EXAMS */}
          {otherTests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTests.map((test) => {
                 const status = getExamStatus(test);
                 return (
                  <motion.div
                    key={test._id}
                    onClick={() => handleCardClick(test)}
                    className={`relative bg-[#0f0f0f] border border-white/5 p-6 rounded-xl transition-all duration-300 ${
                      status === 'UPCOMING' ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-2 cursor-pointer hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${
                        status === 'LIVE' ? 'bg-green-500/10 text-green-400' :
                        status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                        status === 'LIVE' ? 'border-green-500 text-green-500 animate-pulse' :
                        status === 'UPCOMING' ? 'border-blue-500 text-blue-500' :
                        'border-gray-600 text-gray-500'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{test.title}</h4>
                    <p className="text-xs text-gray-500 mb-4">{new Date(test.scheduledAt).toDateString()}</p>

                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4">
                       <span className="flex items-center gap-1"><Clock size={12}/> {test.duration} min</span>
                       <span>{test.totalMarks} marks</span>
                    </div>
                  </motion.div>
                 );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
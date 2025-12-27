"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, Clock, AlertCircle, PlayCircle, FileText, Trophy, Lock, CheckCircle, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function StudentTestViewer({ courseId }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Fetch Data
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/tests`);
        const data = await res.json();
        
        if (data.success) {
          setTests(data.tests);
        } else {
          console.error("API Error:", data.error);
        }
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchTests();
  }, [courseId]);

  // Helper: Status Checker
  const getExamStatus = (test) => {
    if (test.isAttempted) return "ATTEMPTED";

    const now = new Date();
    const start = new Date(test.scheduledAt);
    
    // Admin Live Status Override
    if (test.status === 'live') return "LIVE";
    if (test.status === 'completed') return "ENDED";

    // Time Based Fallback
    if (now < start) return "UPCOMING";
    
    // Default fallback
    return "UPCOMING";
  };

  // 1. Click Handler Logic
  const handleCardClick = (test) => {
    const status = getExamStatus(test);

    // Block UPCOMING exams
    if (status === "UPCOMING") {
      toast("Exam has not started yet!", { icon: "🔒", style: { background: '#333', color: '#fff' } });
      return;
    }

    if (status === "LIVE") {
        if(window.confirm(`Ready to start ${test.title}?`)) {
            router.push(`/portal/exam/${test._id}`);
        }
    } else if (status === "ATTEMPTED") {
        router.push(`/dashboard/classroom/${courseId}/tests/${test._id}/result`);
    } else if (status === "ENDED") {
        // Redirect to Leaderboard
        router.push(`/dashboard/classroom/${courseId}/tests/${test._id}/leaderboard`);
    }
  };

  // 2. Filter & Sort
  const filteredTests = useMemo(() => {
    let data = tests || [];
    if (searchQuery) {
      data = data.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return data;
  }, [tests, searchQuery]);

  const featuredTest = useMemo(() => {
      return filteredTests.find(t => getExamStatus(t) === "LIVE") || 
             filteredTests.find(t => getExamStatus(t) === "UPCOMING") || 
             filteredTests[0];
  }, [filteredTests]);

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-mono animate-pulse">SYNCING EXAMS...</p>
      </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen pb-20 md:pb-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 uppercase tracking-tighter">
            EXAM PORTAL
            </h2>
            <p className="text-gray-500 text-xs font-mono mt-1">TEST YOUR KNOWLEDGE</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-yellow-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search exams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 text-white placeholder:text-gray-700 transition-all"
            />
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a]">
            <Trophy size={48} className="text-gray-700 mb-4"/>
            <p className="text-gray-500 font-mono">No exams scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* FEATURED HERO CARD */}
          {featuredTest && (() => {
             const status = getExamStatus(featuredTest);
             const isClickable = status !== 'UPCOMING';

             return (
                <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                onClick={() => isClickable && handleCardClick(featuredTest)}
                >
                <div className={`absolute -inset-0.5 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500 bg-gradient-to-r ${
                    status === 'LIVE' ? 'from-green-500 to-emerald-600' :
                    status === 'ATTEMPTED' ? 'from-blue-500 to-cyan-600' :
                    status === 'UPCOMING' ? 'from-gray-700 to-gray-600' :
                    'from-yellow-600 to-orange-600'
                }`}></div>
                
                <div className="relative bg-[#050505] border border-white/10 p-6 md:p-10 rounded-3xl overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
                        {status === 'LIVE' ? <Clock size={200} /> : <Trophy size={200} />}
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        status === 'LIVE' ? 'bg-green-500/10 border-green-500 text-green-400 animate-pulse' :
                        status === 'ATTEMPTED' ? 'bg-blue-500/10 border-blue-500 text-blue-400' :
                        status === 'UPCOMING' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' :
                        'bg-gray-800 text-gray-400 border-gray-700'
                        }`}>
                        {status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>}
                        {status}
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-none uppercase">
                        {featuredTest.title}
                        </h1>
                        
                        <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-400 font-mono">
                            <span className="bg-white/5 px-3 py-1.5 rounded flex items-center gap-2"><Calendar size={14}/> {new Date(featuredTest.scheduledAt).toLocaleDateString()}</span>
                            <span className="bg-white/5 px-3 py-1.5 rounded flex items-center gap-2"><Clock size={14}/> {featuredTest.duration} MIN</span>
                            <span className="bg-white/5 px-3 py-1.5 rounded flex items-center gap-2"><AlertCircle size={14}/> {featuredTest.totalMarks} MARKS</span>
                        </div>
                    </div>

                    <div className="flex justify-start md:justify-end">
                        <button 
                            disabled={!isClickable}
                            className={`w-full md:w-auto font-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform shadow-2xl ${
                            status === 'LIVE' ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-900/20 group-hover:scale-105' :
                            status === 'ATTEMPTED' ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20 group-hover:scale-105' :
                            status === 'UPCOMING' ? 'bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed' :
                            'bg-white text-black hover:bg-gray-200 group-hover:scale-105'
                        }`}>
                            {status === 'LIVE' ? <><PlayCircle size={24} fill="black"/> START EXAM</> : 
                            status === 'ATTEMPTED' ? <><BarChart2 size={24}/> VIEW REPORT</> :
                            status === 'UPCOMING' ? <><Lock size={20}/> LOCKED</> :
                            <><CheckCircle size={20}/> VIEW RESULT</>}
                        </button>
                    </div>
                    </div>
                </div>
                </motion.div>
             );
          })()}

          {/* GRID LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.filter(t => t._id !== featuredTest?._id).map((test) => {
                 const status = getExamStatus(test);
                 const isClickable = status !== 'UPCOMING';

                 return (
                  <motion.div
                    key={test._id}
                    onClick={() => isClickable && handleCardClick(test)}
                    className={`relative bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl transition-all duration-300 group 
                    ${isClickable ? 'hover:-translate-y-1 hover:border-yellow-500/30 cursor-pointer' : 'cursor-not-allowed opacity-60'}
                    ${status === 'LIVE' ? 'border-green-500/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${
                        status === 'LIVE' ? 'bg-green-500/10 text-green-400' :
                        status === 'ATTEMPTED' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {status === 'ATTEMPTED' ? <CheckCircle size={20}/> : <FileText size={20} />}
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                        status === 'LIVE' ? 'bg-green-500 text-black' :
                        status === 'UPCOMING' ? 'text-yellow-500 border border-yellow-500/20' :
                        'text-gray-600 border border-gray-800'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">{test.title}</h4>
                    <p className="text-xs text-gray-500 mb-6 font-mono">{new Date(test.scheduledAt).toDateString()}</p>

                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-t border-white/5 pt-4">
                       <span className="flex items-center gap-1.5"><Clock size={12}/> {test.duration} min</span>
                       <span>{test.totalMarks} Mks</span>
                    </div>
                  </motion.div>
                 );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
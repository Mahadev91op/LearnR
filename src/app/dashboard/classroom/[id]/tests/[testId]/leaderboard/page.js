"use client";
import { useState, useEffect, use } from "react"; // 1. 'use' import करें
import { useRouter } from "next/navigation";
import { Trophy, XCircle, FileText, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function LeaderboardPage({ params }) {
  // ✅ FIX: Next.js 15+ में params एक Promise है, इसलिए 'use()' का इस्तेमाल करें
  const { id: courseId, testId } = use(params); 

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!courseId || !testId) return;

      try {
        const res = await fetch(`/api/courses/${courseId}/tests/${testId}/leaderboard`);
        const data = await res.json();
        if (data.success) {
          setStudents(data.leaderboard);
        } else {
          toast.error(data.message || "Failed to load rankings");
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [courseId, testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-400 animate-pulse font-mono tracking-widest">
        LOADING LEADERBOARD...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pb-24 relative overflow-hidden">
      
      {/* Background Neon Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <div className="flex items-center gap-4 w-full md:w-auto">
             <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition group">
               <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
             </button>
             <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-tighter">
               Leaderboard
             </h1>
           </div>

           <button 
             onClick={() => router.push(`/dashboard/classroom/${courseId}/tests/${testId}/result`)}
             className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition shadow-[0_0_15px_rgba(250,204,21,0.4)] active:scale-95"
           >
             <FileText size={18} /> 
             <span>View My Result</span>
           </button>
        </div>

        {/* Top 3 Podium (Desktop Only) */}
        {students.length >= 3 && (
          <div className="hidden md:flex justify-center items-end gap-6 mb-16 mt-12">
            
            {/* 2nd Place */}
            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 rounded-full border-4 border-gray-400 overflow-hidden mb-3 shadow-[0_0_20px_rgba(156,163,175,0.3)] group-hover:shadow-[0_0_30px_rgba(156,163,175,0.5)] transition">
                <img src={students[1].avatar || "/default-avatar.png"} alt={students[1].name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-gray-300 line-clamp-1 max-w-[120px]">{students[1].name}</div>
                <div className="text-xs font-mono text-gray-500">{students[1].marks} Marks</div>
              </div>
              <div className="w-24 h-32 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-xl flex items-center justify-center text-4xl font-black text-gray-400/50 border-t border-gray-500/30">
                2
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-10 relative z-10 group cursor-default">
              <div className="absolute -top-16 text-yellow-400 animate-bounce drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                <Trophy size={48} />
              </div>
              <div className="w-28 h-28 rounded-full border-4 border-yellow-400 overflow-hidden mb-3 shadow-[0_0_30px_rgba(250,204,21,0.5)] group-hover:shadow-[0_0_50px_rgba(250,204,21,0.7)] transition">
                <img src={students[0].avatar || "/default-avatar.png"} alt={students[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-yellow-400 text-lg line-clamp-1 max-w-[150px]">{students[0].name}</div>
                <div className="text-sm font-mono text-yellow-200/70">{students[0].marks} Marks</div>
              </div>
              <div className="w-32 h-44 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-xl flex items-center justify-center text-6xl font-black text-white/50 shadow-[0_0_50px_rgba(250,204,21,0.2)] border-t border-yellow-300/30">
                1
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden mb-3 shadow-[0_0_20px_rgba(194,65,12,0.3)] group-hover:shadow-[0_0_30px_rgba(194,65,12,0.5)] transition">
                <img src={students[2].avatar || "/default-avatar.png"} alt={students[2].name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-orange-400 line-clamp-1 max-w-[120px]">{students[2].name}</div>
                <div className="text-xs font-mono text-orange-500">{students[2].marks} Marks</div>
              </div>
              <div className="w-24 h-24 bg-gradient-to-t from-orange-900 to-orange-700 rounded-t-xl flex items-center justify-center text-4xl font-black text-orange-200/30 border-t border-orange-600/30">
                3
              </div>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="space-y-3">
          {students.map((student, index) => (
            <div 
              key={student.studentId}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                index === 0 ? 'bg-yellow-400/10 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 
                index === 1 ? 'bg-gray-400/10 border-gray-400/50' :
                index === 2 ? 'bg-orange-700/10 border-orange-700/50' :
                'bg-[#111] border-white/5 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className={`font-mono font-bold text-xl w-8 text-center ${
                 index === 0 ? 'text-yellow-400' : 
                 index === 1 ? 'text-gray-400' :
                 index === 2 ? 'text-orange-500' : 'text-gray-600'
              }`}>
                #{index + 1}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0 border border-white/10">
                <img src={student.avatar || "/default-avatar.png"} alt={student.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-sm md:text-base ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                  {student.name}
                </h3>
                <div className="flex items-center gap-2 text-xs mt-0.5">
                  {student.status === "Absent" ? (
                    <span className="text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-full"><XCircle size={10}/> Absent</span>
                  ) : (
                     <span className="text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full">Attempted</span>
                  )}
                </div>
              </div>

              <div className="text-right min-w-[60px]">
                <div className={`font-black text-xl md:text-2xl ${
                   student.marks === 0 && student.status === "Absent" ? 'text-red-500' : 'text-cyan-400'
                }`}>
                  {student.marks}
                </div>
                <div className="text-[9px] md:text-[10px] uppercase text-gray-500 font-bold tracking-wider">Marks</div>
              </div>
            </div>
          ))}

          {students.length === 0 && (
            <div className="text-center py-20 text-gray-500 bg-[#111] rounded-xl border border-white/5">
              <Trophy size={48} className="mx-auto mb-4 opacity-20" />
              <p>No results found for this test yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
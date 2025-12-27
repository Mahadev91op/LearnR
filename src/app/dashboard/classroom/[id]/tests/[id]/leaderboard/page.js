"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trophy, XCircle, FileText, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function LeaderboardPage({ params }) {
  // FIX: [id] folder hone ki wajah se yahan 'id' milega, jise hum 'courseId' maanenge
  const { id: courseId, testId } = params; 
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/tests/${testId}/leaderboard`);
        const data = await res.json();
        if (data.success) {
          setStudents(data.leaderboard);
        }
      } catch (error) {
        toast.error("Failed to load rankings");
      } finally {
        setLoading(false);
      }
    };
    if (courseId && testId) fetchLeaderboard();
  }, [courseId, testId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 animate-pulse">Loading Ranks...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pb-24 relative overflow-hidden">
      
      {/* Background Neon Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
           <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
             <ArrowLeft size={20} />
           </button>
           <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-tighter">
             Leaderboard
           </h1>
           <button 
             onClick={() => router.push(`/dashboard/classroom/${courseId}/tests/${testId}/result`)}
             className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition shadow-[0_0_15px_rgba(250,204,21,0.4)]"
           >
             <FileText size={16} /> My Paper
           </button>
        </div>

        {/* Top 3 Podium (Desktop Only) */}
        {students.length >= 3 && (
          <div className="hidden md:flex justify-center items-end gap-4 mb-12 mt-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-gray-400 overflow-hidden mb-2 shadow-[0_0_20px_rgba(156,163,175,0.3)]">
                <img src={students[1].avatar || "/default-avatar.png"} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-gray-300">{students[1].name}</div>
                <div className="text-sm text-gray-500">{students[1].marks} Marks</div>
              </div>
              <div className="w-24 h-32 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-lg flex items-center justify-center text-4xl font-black text-gray-400/50">2</div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8 relative z-10">
              <div className="absolute -top-16 text-yellow-400 animate-bounce"><Trophy size={40} /></div>
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                <img src={students[0].avatar || "/default-avatar.png"} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-yellow-400 text-lg">{students[0].name}</div>
                <div className="text-sm text-yellow-200/70">{students[0].marks} Marks</div>
              </div>
              <div className="w-28 h-40 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg flex items-center justify-center text-5xl font-black text-white/50 shadow-[0_0_50px_rgba(250,204,21,0.2)]">1</div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden mb-2 shadow-[0_0_20px_rgba(194,65,12,0.3)]">
                <img src={students[2].avatar || "/default-avatar.png"} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold text-orange-400">{students[2].name}</div>
                <div className="text-sm text-orange-500">{students[2].marks} Marks</div>
              </div>
              <div className="w-24 h-24 bg-gradient-to-t from-orange-900 to-orange-700 rounded-t-lg flex items-center justify-center text-4xl font-black text-orange-200/30">3</div>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="space-y-3">
          {students.map((student, index) => (
            <div 
              key={student.studentId}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                index === 0 ? 'bg-yellow-400/10 border-yellow-400/50' : 
                index === 1 ? 'bg-gray-400/10 border-gray-400/50' :
                index === 2 ? 'bg-orange-700/10 border-orange-700/50' :
                'bg-[#111] border-white/5 hover:bg-white/5'
              }`}
            >
              <div className="font-mono font-bold text-xl w-8 text-center text-gray-500">
                #{index + 1}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0">
                <img src={student.avatar || "/default-avatar.png"} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <h3 className={`font-bold ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                  {student.name}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  {student.status === "Absent" ? (
                    <span className="text-red-500 flex items-center gap-1"><XCircle size={10}/> Absent</span>
                  ) : (
                     <span className="text-green-500">Submitted</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className={`font-black text-xl ${
                   student.marks === 0 ? 'text-red-500' : 'text-cyan-400'
                }`}>
                  {student.marks}
                </div>
                <div className="text-[10px] uppercase text-gray-500 font-bold">Marks</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
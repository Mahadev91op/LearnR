"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Clock, ChevronRight, Menu, Flag, RotateCcw
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ExamPortalPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id;

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [markedForReview, setMarkedForReview] = useState({});
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. FETCH EXAM DATA (Start Exam)
  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await fetch(`/api/exam/${testId}/start`);
        
        // Check if response is valid JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server Error: Please try again later.");
        }

        const data = await res.json();

        if (!res.ok) {
           throw new Error(data.error || "Failed to start exam");
        }

        if (!data.test || !data.test.questions || data.test.questions.length === 0) {
            throw new Error("Exam data is invalid or empty.");
        }

        setTest(data.test);
        setQuestions(data.test.questions);
        
        // Timer Logic
        const durationSec = (data.test.duration || 60) * 60;
        setTimeLeft(durationSec);
        
        setLoading(false); // Success: Stop Loading

      } catch (error) {
        console.error("Exam Error:", error);
        toast.error(error.message);
        router.replace("/dashboard"); // Error: Redirect to Dashboard
      }
    };

    if (testId) startExam();
  }, [testId, router]);

  // 2. TIMER EFFECT
  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
           if(prev <= 1) {
               clearInterval(timer);
               handleSubmit(true); // Auto Submit
               return 0;
           }
           return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h+':' : ''}${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
  };

  // 3. HANDLERS
  const handleOptionSelect = (optIndex) => {
      setAnswers(prev => ({ ...prev, [currentQIndex]: optIndex }));
  };

  const handleClearResponse = () => {
      const newAns = { ...answers };
      delete newAns[currentQIndex];
      setAnswers(newAns);
  };

  const handleReviewToggle = () => {
      setMarkedForReview(prev => ({
          ...prev,
          [currentQIndex]: !prev[currentQIndex]
      }));
  };

  const handleSubmit = async (auto = false) => {
      if(!auto && !confirm("Are you sure you want to submit the exam?")) return;
      
      setIsSubmitting(true);
      try {
          const answersArray = questions.map((_, idx) => 
              answers[idx] !== undefined ? answers[idx] : -1
          );

          const res = await fetch(`/api/exam/${testId}/submit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  answers: answersArray,
                  timeTaken: (test.duration * 60) - timeLeft
              })
          });

          const result = await res.json();
          if(res.ok) {
              toast.success("Exam Submitted Successfully!");
              router.replace(`/dashboard/classroom/${test.courseId}/tests/${testId}/result`);
          } else {
              toast.error(result.error || "Submission Failed");
              setIsSubmitting(false);
          }
      } catch (error) {
          toast.error("Network Error: Could not submit.");
          setIsSubmitting(false);
      }
  };

  // --- RENDER ---
  if (loading) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="text-yellow-500 font-mono animate-pulse">Loading Exam Environment...</p>
        </div>
    );
  }

  // Safety Check if test data missing after loading
  if (!test || !questions.length) return null;

  const currentQ = questions[currentQIndex];
  const isReview = markedForReview[currentQIndex];

  return (
    <div className="fixed inset-0 bg-[#050505] text-white flex flex-col overflow-hidden font-sans selection:bg-yellow-500/30">
        
        {/* TOP BAR */}
        <header className="h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between px-4 md:px-6 z-20 relative">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    L
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight md:block hidden">{test.title}</h1>
                    <p className="text-xs text-gray-500 font-mono">Q: {currentQIndex + 1}/{questions.length}</p>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-gray-900 border-white/10 text-yellow-400'}`}>
                    <Clock size={18} />
                    <span className="font-mono text-xl font-bold tracking-widest">{formatTime(timeLeft)}</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
                    <Menu size={24}/>
                </button>
            </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* LEFT: QUESTION AREA */}
            <main className="flex-1 flex flex-col relative z-10">
                <div className="h-1 bg-gray-900 w-full">
                    <div 
                       className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
                       style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
                    <div className="max-w-4xl mx-auto pb-20">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)]">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-100 leading-relaxed">
                                    <span className="text-yellow-500 mr-3">Q{currentQIndex + 1}.</span>
                                    {currentQ.questionText}
                                </h2>
                                <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-gray-400 font-mono">+1.0 / -0.25</span>
                            </div>

                            <div className="space-y-3 pl-0 md:pl-11">
                                {currentQ.options.map((opt, idx) => {
                                    const isSelected = answers[currentQIndex] === idx;
                                    return (
                                        <div 
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            className={`
                                                group relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                                ${isSelected ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/5 bg-[#121212] hover:bg-[#181818] hover:border-white/20'}
                                            `}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                {isSelected && <div className="w-2 h-2 bg-black rounded-full"></div>}
                                            </div>
                                            <span className={`text-lg ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>{opt}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="h-20 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between px-6 md:px-10 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={handleReviewToggle} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm border ${isReview ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}>
                            <Flag size={16} fill={isReview ? "currentColor" : "none"}/> <span className="hidden md:inline">{isReview ? 'Unmark' : 'Mark Review'}</span>
                        </button>
                        <button onClick={handleClearResponse} className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5">
                            <RotateCcw size={16}/> <span className="hidden md:inline">Clear</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(prev => prev - 1)} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed">Prev</button>
                        
                        {currentQIndex === questions.length - 1 ? (
                             <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95">
                                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                             </button>
                        ) : (
                            <button onClick={() => setCurrentQIndex(prev => prev + 1)} className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95 flex items-center gap-2">
                                Next <ChevronRight size={18} strokeWidth={3}/>
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className={`absolute md:relative top-0 right-0 h-full w-80 bg-[#080808] border-l border-white/10 z-30 transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                <div className="p-4 border-b border-white/10 bg-[#111] font-bold text-white text-sm">Question Palette</div>
                <div className="p-6 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar">
                    <div className="grid grid-cols-4 gap-3">
                        {questions.map((_, idx) => {
                            const isCurr = currentQIndex === idx;
                            const hasAns = answers[idx] !== undefined;
                            const isMarked = markedForReview[idx];
                            let btnClass = "bg-[#151515] text-gray-500 border-white/5"; 
                            if (isCurr) btnClass = "bg-yellow-500 text-black ring-2 ring-yellow-500/50";
                            else if (isMarked) btnClass = "bg-purple-900/50 text-purple-400 border-purple-500/50";
                            else if (hasAns) btnClass = "bg-green-900/50 text-green-400 border-green-500/50";

                            return (
                                <button key={idx} onClick={() => { setCurrentQIndex(idx); setIsSidebarOpen(false); }} className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm border transition-all ${btnClass}`}>
                                    {idx + 1}
                                    {isMarked && <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_5px_currentColor]"></div>}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </aside>
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"></div>}
        </div>
    </div>
  );
}
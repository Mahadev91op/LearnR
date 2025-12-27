"use client";
import { useState, useEffect, useRef, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ExamPortal({ params }) {
  // 1. ✅ FIX: Params को unwrap करना (Next.js 15+)
  const { id } = use(params);
  
  const router = useRouter();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Anti-Cheat States
  const [isTabActive, setIsTabActive] = useState(true);
  const [countdown, setCountdown] = useState(20); 
  const cheatIntervalRef = useRef(null);

  // 1. Fetch Exam Data (Secure)
  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/exam/${id}/start`);
        const data = await res.json();
        
        if (!data.success) {
          toast.error(data.message || "Failed to start exam");
          
          // ✅ FIX: Error पढ़ने के लिए 3 सेकंड रुकें, फिर Redirect करें
          setTimeout(() => {
            router.back();
          }, 3000);
          return;
        }

        setTest(data.test);
        setTimeLeft(data.test.duration * 60);
        
        // Fullscreen Mode Attempt
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading exam environment");
        setTimeout(() => router.back(), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id, router]);

  // 2. Submit Function (Memoized)
  const handleSubmit = useCallback(async (isAuto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const loadingToast = toast.loading(isAuto ? "Auto-Submitting..." : "Submitting Exam...");
    
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOption: answers[qId]
    }));

    try {
      const res = await fetch(`/api/exam/${id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers: formattedAnswers, isAutoSubmit: isAuto }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Exam Submitted!", { id: loadingToast });
        window.location.href = "/dashboard/classroom"; 
      } else {
        toast.error(data.message, { id: loadingToast });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Submission failed. Check internet.", { id: loadingToast });
      setIsSubmitting(false);
    }
  }, [answers, id, isSubmitting]);

  // 3. Timer Logic
  useEffect(() => {
    if (!timeLeft || isSubmitting) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, handleSubmit]);

  // 4. Anti-Cheat Logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        setCountdown(20);
        
        cheatIntervalRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(cheatIntervalRef.current);
              handleSubmit(true); 
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        setIsTabActive(true);
        if (cheatIntervalRef.current) clearInterval(cheatIntervalRef.current);
        toast("⚠️ Don't switch tabs! Exam will auto-submit.", { 
            icon: "🚫",
            style: { background: '#ff4444', color: '#fff' }
        });
      }
    };

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => { e.preventDefault(); toast.error("Copy/Paste disabled!"); };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handleCopy);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handleCopy);
      if (cheatIntervalRef.current) clearInterval(cheatIntervalRef.current);
    };
  }, [handleSubmit]);

  // --- RENDER ---

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-yellow-400">
        <Loader2 className="animate-spin mr-2"/> Preparing Secure Environment...
      </div>
    );
  }

  // ✅ FIX: अगर Test डेटा null है, तो Crash से बचाओ और Message दिखाओ
  if (!test) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-red-500">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-bold">Unable to load exam</h2>
        <p className="text-gray-500 mt-2">Redirecting to classroom...</p>
      </div>
    );
  }

  // Warning Overlay
  if (!isTabActive) {
    return (
      <div className="fixed inset-0 z-50 bg-red-900 flex flex-col items-center justify-center text-white text-center p-4">
        <AlertTriangle size={80} className="mb-4 animate-bounce" />
        <h1 className="text-4xl font-black mb-4">WARNING!</h1>
        <p className="text-xl mb-6">You have left the secure exam window.</p>
        <div className="bg-black/30 p-6 rounded-xl border border-red-500">
          <p className="text-3xl font-mono font-bold text-red-400">Auto-Submitting in {countdown}s</p>
        </div>
        <p className="mt-8 text-gray-300">Return to the exam tab IMMEDIATELY to stop the timer.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 select-none pb-24">
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#111] border-b border-white/10 p-4 flex justify-between items-center z-40 shadow-xl">
        <h2 className="font-bold text-lg truncate max-w-[200px] md:max-w-md text-gray-300">
          {test.title}
        </h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-xl transition-colors ${timeLeft < 300 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-blue-500/10 text-blue-400'}`}>
          <Clock size={20} />
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto pt-24 px-4 md:px-8">
        {test.questions.map((q, index) => (
          <div key={q._id} className="mb-8 p-6 bg-[#111] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-500 font-mono">Question {index + 1}</span>
              <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">{q.marks} Mark</span>
            </div>
            
            <p className="text-lg md:text-xl font-medium text-white mb-6 whitespace-pre-wrap leading-relaxed">
              {q.questionText}
            </p>
            
            <div className="space-y-3">
              {q.options.map((opt, optIndex) => (
                <label 
                  key={optIndex} 
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    answers[q._id] === optIndex 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                    : 'bg-[#1a1a1a] border-white/5 hover:bg-[#222] hover:border-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                     answers[q._id] === optIndex ? 'border-blue-500 bg-blue-500' : 'border-gray-600'
                  }`}>
                    {answers[q._id] === optIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm md:text-base">{opt}</span>
                  
                  <input 
                    type="radio" 
                    name={`q-${q._id}`} 
                    className="hidden"
                    onChange={() => setAnswers(prev => ({ ...prev, [q._id]: optIndex }))}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/10 p-4 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500 hidden md:block">
            <span className="text-white font-bold">{Object.keys(answers).length}</span> / {test.questions.length} Attempted
          </div>
          
          <button 
            disabled={isSubmitting}
            onClick={() => {
              if (window.confirm("Are you sure you want to submit?")) {
                handleSubmit(false);
              }
            }}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black uppercase tracking-wider px-8 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>

    </div>
  );
}
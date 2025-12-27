"use client";
import { useState, useEffect, use } from "react"; // 1. 'use' import करें
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ResultViewer({ params }) {
  // 2. PARAMS FIX: Params को unwrape करें और सही variables मैप करें
  // 'id' (outer folder) = courseId
  // 'testId' (inner folder) = testId
  const { id: courseId, testId } = use(params);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchResult();
  }, [testId]);

  const fetchResult = async () => {
    try {
      // API call में सही testId इस्तेमाल करें
      const res = await fetch(`/api/exam/${testId}/result`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        toast.error(json.message);
        router.back();
      }
    } catch (error) {
      toast.error("Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-white animate-pulse">Calculating Score...</div>;

  if (!data) return <div className="text-white text-center">No Result Found</div>;

  // Percentage Calculation
  const percentage = Math.round((data.obtainedMarks / data.totalMarks) * 100);
  const gradeColor = percentage >= 80 ? "text-green-400" : percentage >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen text-gray-200 pb-20">
      
      {/* 1. Header & Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={20} /> Back to Exams
      </button>

      {/* 2. Score Card */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <CheckCircle size={200} />
        </div>
        
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-white mb-2">Exam Result</h1>
          <p className="text-gray-400 mb-6">Here is how you performed</p>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            
            {/* Score Big Display */}
            <div className="text-center">
              <span className={`text-6xl md:text-7xl font-black ${gradeColor}`}>
                {data.obtainedMarks}
              </span>
              <span className="text-2xl text-gray-500 font-bold"> / {data.totalMarks}</span>
              <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">Total Score</p>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm md:text-base">
               <div className="flex items-center gap-3">
                 <CheckCircle size={18} className="text-green-500" />
                 <span>Correct: <span className="text-white font-bold">{data.questions.filter(q => q.selectedOption === q.correctOption && data.isResultDeclared).length}</span></span>
               </div>
               <div className="flex items-center gap-3">
                 <XCircle size={18} className="text-red-500" />
                 <span>Wrong: <span className="text-white font-bold">{data.questions.filter(q => q.selectedOption !== null && q.selectedOption !== q.correctOption && data.isResultDeclared).length}</span></span>
               </div>
               <div className="flex items-center gap-3">
                 <AlertCircle size={18} className="text-gray-500" />
                 <span>Unattempted: <span className="text-white font-bold">{data.questions.filter(q => q.selectedOption === null).length}</span></span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WARNING if Result is Hidden (Time Logic) */}
      {!data.isResultDeclared && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-8 flex items-start gap-4">
          <Clock className="text-blue-400 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-400">Detailed Analysis Pending</h3>
            <p className="text-sm text-gray-300 mt-1">
              Full solutions and explanations will be revealed after the exam window closes (12 hours from start time).
              <br />
              Expected at: <span className="text-white font-mono">{new Date(data.revealTime).toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}

      {/* 4. Question Analysis (Only if Declared) */}
      {data.isResultDeclared && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-l-4 border-yellow-400 pl-4 mb-6">Detailed Analysis</h2>
          
          {data.questions.map((q, i) => {
            const isCorrect = q.selectedOption === q.correctOption;
            const isSkipped = q.selectedOption === null;
            
            return (
              <div key={i} className={`p-6 rounded-xl border ${
                isCorrect ? 'bg-green-500/5 border-green-500/20' : 
                isSkipped ? 'bg-[#111] border-white/5' : 
                'bg-red-500/5 border-red-500/20'
              }`}>
                
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <span className="font-mono text-gray-500">Q{i+1}.</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                        isCorrect ? 'bg-green-500/20 text-green-400' :
                        isSkipped ? 'bg-gray-700 text-gray-300' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                      </span>
                   </div>
                   <span className="text-xs text-gray-500">{q.marks} Marks</span>
                </div>

                <p className="text-lg text-white font-medium mb-4">{q.questionText}</p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt, idx) => {
                    let optionClass = "bg-[#0a0a0a] border-white/5 text-gray-400"; // Default
                    
                    if (idx === q.correctOption) {
                      optionClass = "bg-green-500/20 border-green-500 text-green-200 font-bold shadow-[0_0_10px_rgba(34,197,94,0.2)]"; // Correct Answer
                    } else if (idx === q.selectedOption && idx !== q.correctOption) {
                      optionClass = "bg-red-500/20 border-red-500 text-red-200 line-through decoration-red-500"; // Wrong Selection
                    }

                    return (
                      <div key={idx} className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${optionClass}`}>
                        <span className="opacity-50 uppercase">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                        {idx === q.correctOption && <CheckCircle size={16} className="ml-auto text-green-400"/>}
                        {idx === q.selectedOption && idx !== q.correctOption && <XCircle size={16} className="ml-auto text-red-400"/>}
                      </div>
                    );
                  })}
                </div>

                {/* Description / Solution */}
                {q.description && (
                  <div className="mt-4 pt-4 border-t border-white/5 text-sm">
                    <span className="text-yellow-500 font-bold uppercase text-xs tracking-wider">Explanation / Solution:</span>
                    <p className="text-gray-300 mt-1 leading-relaxed">
                      {q.description}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
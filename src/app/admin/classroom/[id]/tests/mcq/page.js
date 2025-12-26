"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Plus, Calendar, Clock, CheckSquare, 
  PlayCircle, StopCircle, Edit, Loader2, X, ArrowLeft
} from "lucide-react";
import { toast } from "react-hot-toast";

// Sidebar Import (Navbar hi Sidebar hai aapke project me)
import ClassroomSidebar from "@/components/classroom/ClassroomNavbar"; 

export default function MCQManagerPage({ params }) {
  const { id: courseId } = use(params);
  const router = useRouter();
  
  // States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [course, setCourse] = useState(null); // To store course title for sidebar
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    totalMarks: 100,
    isManualStart: false,
  });

  // 1. FETCH DATA (Course + Tests)
  const fetchData = async () => {
    try {
      // Fetch Course Details (For Sidebar Title)
      const courseRes = await fetch(`/api/admin/courses/${courseId}`);
      if (courseRes.ok) {
         const courseData = await courseRes.json();
         setCourse(courseData);
      }

      // Fetch Tests
      const testsRes = await fetch(`/api/admin/courses/${courseId}/tests?type=mcq`);
      if (testsRes.ok) {
          const testsData = await testsRes.json();
          setTests(testsData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(courseId) fetchData();
  }, [courseId]);

  // 2. CREATE TEST HANDLER
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "mcq" }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create test");
      
      toast.success("Quiz Created Successfully!");
      setIsModalOpen(false);
      fetchData(); // Refresh list
      
      setFormData({
        title: "", description: "", scheduledDate: "",
        scheduledTime: "", duration: 60, totalMarks: 100, isManualStart: false
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. START/STOP TEST HANDLER
  const toggleStatus = async (testId, newStatus) => {
    try {
        const res = await fetch(`/api/admin/tests/${testId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        if(res.ok) {
            toast.success(`Exam is now ${newStatus}`);
            fetchData();
        }
    } catch (err) {
        toast.error("Action failed");
    }
  };

  // Sidebar Tab Handler: Agar koi aur tab click ho to wapas main page bhejo
  const handleSidebarTabChange = (tab) => {
     if (tab !== 'tests') {
        router.push(`/admin/classroom/${courseId}`);
     }
  };

  const filteredTests = tests.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center text-white">
         <Loader2 className="h-10 w-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    // FULL PAGE LAYOUT (Sidebar + Content)
    <div className="fixed inset-0 bg-[#050505] z-[100] overflow-hidden flex flex-col md:flex-row">
       
       {/* 1. LEFT SIDEBAR (Persisted) */}
       <ClassroomSidebar 
          activeTab="tests" // Always keep 'tests' active here
          setActiveTab={handleSidebarTabChange} 
          courseTitle={course?.title || "Loading..."} 
       />

       {/* 2. MAIN CONTENT AREA */}
       <div className="flex-1 relative h-full overflow-y-auto scroll-smooth md:ml-64 pt-14 pb-20 md:py-0 md:pb-0 bg-[#050505]">
          
          <div className="min-h-full p-4 md:p-8">
            {/* Back Button for Mobile/Desktop UX */}
            <button onClick={() => router.push(`/admin/classroom/${courseId}`)} className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
               <ArrowLeft size={16} className="mr-2"/> Back to Dashboard
            </button>

            {/* --- PAGE HEADER --- */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4">
                <div>
                <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                    MCQ Manager
                </h1>
                <p className="text-gray-500 text-sm">Manage quizzes, entrance tests & practice sets</p>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-cyan-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search exams..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white"
                        />
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-cyan-500 text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} /> <span className="hidden md:inline">Create Quiz</span><span className="md:hidden">New</span>
                    </button>
                </div>
            </div>

            {/* --- EXAM CARDS GRID --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredTests.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <CheckSquare size={30}/>
                        </div>
                        <p className="text-gray-400 font-medium">No exams found</p>
                        <p className="text-gray-600 text-sm mt-1">Create your first quiz to get started</p>
                    </div>
                ) : (
                    filteredTests.map((test) => (
                        <div 
                        key={test._id}
                        className="group relative bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)]"
                        >
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            {test.status === 'live' ? (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-wider animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> LIVE NOW
                                </span>
                            ) : test.status === 'completed' ? (
                                <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 text-[10px] font-bold">ENDED</span>
                            ) : (
                                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">SCHEDULED</span>
                            )}
                        </div>

                        {/* Card Content */}
                        <div className="cursor-pointer" onClick={() => router.push(`/admin/classroom/${courseId}/tests/mcq/${test._id}`)}>
                            <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1 pr-16">
                                {test.title}
                            </h3>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <Calendar size={14} />
                                {new Date(test.scheduledAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <Clock size={14} />
                                {new Date(test.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                <span className="text-gray-600">•</span> {test.duration} Mins
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                            <div className="text-xs font-mono text-gray-500">
                                {test.questions?.length || 0} Qs • {test.totalMarks} Marks
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {test.isManualStart && test.status === 'scheduled' && (
                                    <button 
                                    onClick={(e) => { e.stopPropagation(); toggleStatus(test._id, 'live'); }}
                                    className="p-2 hover:bg-green-500/20 rounded-lg text-green-500 transition-colors"
                                    title="Start Exam Now"
                                    >
                                        <PlayCircle size={18} />
                                    </button>
                                )}
                                
                                {test.status === 'live' && (
                                    <button 
                                    onClick={(e) => { e.stopPropagation(); toggleStatus(test._id, 'completed'); }}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                                    title="End Exam"
                                    >
                                        <StopCircle size={18} />
                                    </button>
                                )}

                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>
                        </div>
                    ))
                )}
            </div>

          </div>
       </div>

      {/* --- CREATE MODAL (Overlay) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                 <h2 className="text-lg font-bold text-white">Create New Quiz</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">EXAM TITLE</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                      placeholder="e.g. Weekly Physics Test"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">DATE</label>
                        <input 
                          type="date"
                          required
                          value={formData.scheduledDate}
                          onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">TIME</label>
                        <input 
                          type="time"
                          required
                          value={formData.scheduledTime}
                          onChange={e => setFormData({...formData, scheduledTime: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">DURATION (Mins)</label>
                        <input 
                          type="number"
                          value={formData.duration}
                          onChange={e => setFormData({...formData, duration: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">TOTAL MARKS</label>
                        <input 
                          type="number"
                          value={formData.totalMarks}
                          onChange={e => setFormData({...formData, totalMarks: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                 </div>

                 <div className="flex items-center gap-3 p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg cursor-pointer" onClick={() => setFormData({...formData, isManualStart: !formData.isManualStart})}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isManualStart ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'}`}>
                        {formData.isManualStart && <CheckSquare size={14} className="text-black"/>}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-cyan-100">Manual Start Mode</p>
                        <p className="text-[10px] text-cyan-500/70">Admin must click "Start" button to launch exam</p>
                    </div>
                 </div>

                 <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-colors mt-4 flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                    {isSubmitting ? (
                        <>
                           <Loader2 className="animate-spin" size={20}/> Creating...
                        </>
                    ) : (
                        "Create & Save Quiz"
                    )}
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
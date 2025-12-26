"use client";
import { useState, useEffect } from "react";
import { 
  Search, Plus, Calendar, Clock, CheckSquare, 
  PlayCircle, StopCircle, Edit, Loader2, X, ArrowLeft
} from "lucide-react";
import { toast } from "react-hot-toast";

// IMPORT THE NEW EDITOR
import MCQEditor from "./MCQEditor";

export default function MCQManager({ courseId, onBack }) {
  // States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW STATE: Selected Test for Editing
  const [selectedTestId, setSelectedTestId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "", description: "", scheduledDate: "", scheduledTime: "", duration: 60, totalMarks: 100, isManualStart: false,
  });

  // 1. FETCH TESTS
  const fetchTests = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/tests?type=mcq`);
      if (res.ok) {
          const data = await res.json();
          setTests(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(courseId && !selectedTestId) fetchTests(); // Fetch only if not editing
  }, [courseId, selectedTestId]);

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
      
      // Auto open editor for new test
      setSelectedTestId(data._id);
      
      setFormData({ title: "", description: "", scheduledDate: "", scheduledTime: "", duration: 60, totalMarks: 100, isManualStart: false });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. START/STOP
  const toggleStatus = async (testId, newStatus) => {
    try {
        const res = await fetch(`/api/admin/tests/${testId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        if(res.ok) {
            toast.success(`Exam is now ${newStatus}`);
            fetchTests();
        }
    } catch (err) { toast.error("Action failed"); }
  };

  // --- RENDER EDITOR IF TEST SELECTED ---
  if (selectedTestId) {
    return <MCQEditor testId={selectedTestId} onBack={() => setSelectedTestId(null)} />;
  }

  // --- RENDER LIST ---
  const filteredTests = tests.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Back Button */}
      <button onClick={onBack} className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={16} className="mr-2"/> Back to Selection
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">MCQ Manager</h1>
           <p className="text-gray-500 text-sm">Manage quizzes, entrance tests & practice sets</p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
           <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-cyan-400 transition-colors" size={18} />
              <input type="text" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white"/>
           </div>
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-cyan-500 text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-cyan-400 transition-all active:scale-95 whitespace-nowrap">
             <Plus size={18} /> <span className="hidden md:inline">Create Quiz</span><span className="md:hidden">New</span>
           </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
         {loading ? (
             <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500"/></div>
         ) : filteredTests.length === 0 ? (
             <div className="col-span-full text-center py-20 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500"><CheckSquare size={30}/></div>
                <p className="text-gray-400 font-medium">No exams found</p>
             </div>
         ) : (
             filteredTests.map((test) => (
                <div 
                  key={test._id}
                  onClick={() => setSelectedTestId(test._id)} // OPEN EDITOR ON CLICK
                  className="group relative bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)] cursor-pointer"
                >
                   {/* Status Badge */}
                   <div className="absolute top-4 right-4">
                      {test.status === 'live' ? <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold animate-pulse">LIVE</span> : <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">SCHEDULED</span>}
                   </div>
                   
                   <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1 pr-16">{test.title}</h3>
                   <div className="space-y-2 mb-6 text-gray-400 text-xs">
                        <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(test.scheduledAt).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><Clock size={14} /> {new Date(test.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {test.duration} Mins</div>
                   </div>

                   <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                      <div className="text-xs font-mono text-gray-500">{test.questions?.length || 0} Qs • {test.totalMarks} Marks</div>
                      <div className="flex items-center gap-2">
                         {test.isManualStart && test.status === 'scheduled' && (
                             <button onClick={(e) => { e.stopPropagation(); toggleStatus(test._id, 'live'); }} className="p-2 hover:bg-green-500/20 rounded-lg text-green-500 transition-colors"><PlayCircle size={18} /></button>
                         )}
                         {test.status === 'live' && (
                             <button onClick={(e) => { e.stopPropagation(); toggleStatus(test._id, 'completed'); }} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"><StopCircle size={18} /></button>
                         )}
                         <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit size={16} /></button>
                      </div>
                   </div>
                </div>
             ))
         )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                 <h2 className="text-lg font-bold text-white">Create New Quiz</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                 <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="Exam Title"/>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" required value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-white outline-none"/>
                    <input type="time" required value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-white outline-none"/>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Duration (min)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-white outline-none"/>
                    <input type="number" placeholder="Total Marks" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-white outline-none"/>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg cursor-pointer" onClick={() => setFormData({...formData, isManualStart: !formData.isManualStart})}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isManualStart ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'}`}>
                        {formData.isManualStart && <CheckSquare size={14} className="text-black"/>}
                    </div>
                    <div><p className="text-sm font-bold text-cyan-100">Manual Start Mode</p></div>
                 </div>
                 <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl mt-4 flex justify-center items-center gap-2">{isSubmitting ? <Loader2 className="animate-spin" size={20}/> : "Create & Start Editing"}</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
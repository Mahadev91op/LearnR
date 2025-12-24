"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Trash2, CheckCircle2, Clock, 
  PlayCircle, BookOpen, Layers, Hash, Calendar, X 
} from "lucide-react";
import { toast } from "react-hot-toast"; // Assuming you have react-hot-toast or use your Toast component

export default function SyllabusManager({ courseId }) {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    chapterNo: "",
    chapterName: "",
    bookName: "",
    topicName: "",
    status: "Pending"
  });

  // Suggestion State (Smart Dropdowns)
  const [showBookSuggestions, setShowBookSuggestions] = useState(false);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  // Fetch Syllabus
  const fetchSyllabus = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/syllabus`);
      const data = await res.json();
      if (res.ok) setSyllabus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [courseId]);

  // Derived Unique Lists for Suggestions (Auto-Learning)
  const bookSuggestions = useMemo(() => 
    [...new Set(syllabus.map(s => s.bookName).filter(Boolean))], 
  [syllabus]);

  const topicSuggestions = useMemo(() => 
    [...new Set(syllabus.map(s => s.topicName).filter(Boolean))], 
  [syllabus]);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `/api/admin/syllabus/${editingId}`
      : `/api/admin/courses/${courseId}/syllabus`;
    
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? "Chapter Updated!" : "Chapter Added!");
        fetchSyllabus();
        closeForm();
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ chapterNo: "", chapterName: "", bookName: "", topicName: "", status: "Pending" });
  };

  const handleEdit = (item) => {
    setFormData({
        chapterNo: item.chapterNo,
        chapterName: item.chapterName,
        bookName: item.bookName,
        topicName: item.topicName,
        status: item.status
    });
    setEditingId(item._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/syllabus/${id}`, { method: "DELETE" });
      setSyllabus(prev => prev.filter(p => p._id !== id));
      toast.success("Deleted!");
    } catch (err) { console.error(err); }
  };

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Ongoing": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Course Syllabus
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage curriculum timeline & progress</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
        >
          <Plus size={20} /> Add Chapter
        </motion.button>
      </div>

      {/* GRAPHICAL TIMELINE DISPLAY */}
      <div className="relative border-l-2 border-dashed border-white/10 ml-4 md:ml-10 space-y-12 pb-20">
        {loading ? <p className="pl-10 text-gray-500 animate-pulse">Loading Roadmap...</p> : 
         syllabus.length === 0 ? <p className="pl-10 text-gray-500">No chapters added yet.</p> :
         syllabus.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item._id} 
            className="relative pl-10 md:pl-16 group"
          >
            {/* Timeline Connector Dot */}
            <div className={`absolute -left-[9px] top-6 w-5 h-5 rounded-full border-4 border-[#050505] 
              ${item.status === "Completed" ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.6)]" : 
                item.status === "Ongoing" ? "bg-yellow-400 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.6)]" : 
                "bg-gray-600"}`} 
            />

            {/* Content Card */}
            <div className={`relative bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 group-hover:bg-[#141414] group-hover:shadow-2xl group-hover:translate-x-2`}>
              
              {/* Card Header & Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                   <span className="text-4xl font-black text-white/5 select-none">#{String(item.chapterNo).padStart(2,'0')}</span>
                   <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{item.chapterName}</h3>
                      {item.completedDate && (
                        <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                          <CheckCircle2 size={12}/> Completed on {new Date(item.completedDate).toLocaleDateString()}
                        </p>
                      )}
                   </div>
                </div>
                
                {/* Status Badge */}
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-fit ${getStatusColor(item.status)}`}>
                   {item.status === "Completed" && <CheckCircle2 size={14} />}
                   {item.status === "Ongoing" && <PlayCircle size={14} className="animate-spin-slow" />}
                   {item.status === "Pending" && <Clock size={14} />}
                   {item.status}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="bg-black/40 p-3 rounded-xl flex items-center gap-3">
                     <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><BookOpen size={18}/></div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 font-bold">Book Reference</p>
                        <p className="text-white font-medium truncate">{item.bookName}</p>
                     </div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl flex items-center gap-3">
                     <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400"><Layers size={18}/></div>
                     <div>
                        <p className="text-xs uppercase text-gray-500 font-bold">Topic Covered</p>
                        <p className="text-white font-medium truncate">{item.topicName}</p>
                     </div>
                  </div>
              </div>

              {/* Admin Actions (Absolute top-right inside card) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleEdit(item)} className="p-2 bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors"><Edit2 size={16}/></button>
                 <button onClick={() => handleDelete(item._id)} className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>

            </div>
          </motion.div>
         ))
        }
      </div>

      {/* ADVANCED ANIMATED FORM MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
               onClick={closeForm}
            />
            <motion.div 
               initial={{ opacity: 0, y: 100, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 100, scale: 0.95 }}
               className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-[#111] border border-white/10 rounded-3xl z-[160] shadow-2xl"
            >
              <div className="p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white">{editingId ? "Edit Chapter" : "Add New Chapter"}</h3>
                    <button onClick={closeForm} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ch. No</label>
                           <div className="relative">
                             <Hash size={16} className="absolute left-3 top-3.5 text-gray-500"/>
                             <input type="number" required placeholder="01" 
                                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                                value={formData.chapterNo} onChange={e => setFormData({...formData, chapterNo: e.target.value})}
                             />
                           </div>
                        </div>
                        <div className="col-span-3">
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Chapter Name</label>
                           <input type="text" required placeholder="e.g. Introduction to Physics" 
                              className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                              value={formData.chapterName} onChange={e => setFormData({...formData, chapterName: e.target.value})}
                           />
                        </div>
                    </div>

                    {/* SMART DROPDOWN: BOOK NAME */}
                    <div className="relative z-20">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Book Name</label>
                       <div className="relative">
                          <BookOpen size={16} className="absolute left-3 top-3.5 text-gray-500"/>
                          <input 
                             type="text" required placeholder="e.g. HC Verma Vol 1"
                             className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-yellow-400 focus:outline-none"
                             value={formData.bookName}
                             onFocus={() => setShowBookSuggestions(true)}
                             onBlur={() => setTimeout(() => setShowBookSuggestions(false), 200)}
                             onChange={e => setFormData({...formData, bookName: e.target.value})}
                          />
                          {/* Suggestions Panel */}
                          {showBookSuggestions && bookSuggestions.length > 0 && (
                            <motion.div initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl mt-2 max-h-40 overflow-y-auto shadow-xl">
                               {bookSuggestions.filter(b => b.toLowerCase().includes(formData.bookName.toLowerCase())).map(book => (
                                 <div key={book} onClick={() => setFormData({...formData, bookName: book})} className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                                    {book}
                                 </div>
                               ))}
                            </motion.div>
                          )}
                       </div>
                    </div>

                    {/* SMART DROPDOWN: TOPIC NAME */}
                    <div className="relative z-10">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic Name</label>
                       <div className="relative">
                          <Layers size={16} className="absolute left-3 top-3.5 text-gray-500"/>
                          <input 
                             type="text" required placeholder="e.g. Rotational Mechanics"
                             className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-yellow-400 focus:outline-none"
                             value={formData.topicName}
                             onFocus={() => setShowTopicSuggestions(true)}
                             onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 200)}
                             onChange={e => setFormData({...formData, topicName: e.target.value})}
                          />
                          {showTopicSuggestions && topicSuggestions.length > 0 && (
                            <motion.div initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl mt-2 max-h-40 overflow-y-auto shadow-xl">
                               {topicSuggestions.filter(t => t.toLowerCase().includes(formData.topicName.toLowerCase())).map(topic => (
                                 <div key={topic} onClick={() => setFormData({...formData, topicName: topic})} className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                                    {topic}
                                 </div>
                               ))}
                            </motion.div>
                          )}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                           <select 
                              value={formData.status} 
                              onChange={e => setFormData({...formData, status: e.target.value})}
                              className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:border-yellow-400 focus:outline-none appearance-none cursor-pointer"
                           >
                              <option value="Pending">Pending ⏳</option>
                              <option value="Ongoing">Ongoing ▶️</option>
                              <option value="Completed">Completed ✅</option>
                           </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20">
                       {editingId ? "Update Chapter Details" : "Add to Syllabus"}
                    </button>
                 </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
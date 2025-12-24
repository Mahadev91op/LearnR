"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Plus, Trash2, Edit2, Download, 
  ExternalLink, Loader2, Sparkles, X, BookOpen, Layers, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";

export default function LectureManager({ courseId }) {
  const [lectures, setLectures] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    title: "",
    chapter: "",     
    bookName: "",    
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    resourceUrl: "",
    isPreview: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    try {
      const res = await fetch(`/api/admin/lectures?courseId=${courseId}`);
      const data = await res.json();
      if (data.lectures) setLectures(data.lectures);
    } catch (error) {
      toast.error("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  // Prepare Edit
  const handleEdit = (lecture) => {
    setEditingId(lecture._id);
    setFormData({
        title: lecture.title,
        chapter: lecture.chapter,
        bookName: lecture.bookName,
        description: lecture.description,
        videoUrl: lecture.videoUrl,
        thumbnailUrl: lecture.thumbnailUrl,
        resourceUrl: lecture.resourceUrl || "",
        isPreview: lecture.isPreview
    });
    setIsFormOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to remove this lecture?")) return;
    
    try {
        const res = await fetch(`/api/admin/lectures/${id}`, { method: "DELETE" });
        
        if(res.ok){
            toast.success("Lecture deleted successfully");
            fetchLectures(); // Refresh list
        } else {
            const data = await res.json();
            toast.error(data.error || "Failed to delete");
        }
    } catch (error) {
        toast.error("Error deleting lecture");
    }
  };

  // Auto-Fetch Logic
  const handleUrlPaste = async (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, videoUrl: url }));

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setFetchingMeta(true);
      try {
        const res = await fetch("/api/admin/lectures/meta", {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        
        if (res.ok) {
            setFormData(prev => ({
                ...prev,
                title: prev.title || data.title, 
                thumbnailUrl: data.thumbnail_url // Auto set thumbnail from YouTube
            }));
            toast.success("Video info fetched!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingMeta(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const url = editingId 
        ? `/api/admin/lectures/${editingId}`
        : "/api/admin/lectures";
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, courseId })
      });
      
      if (res.ok) {
        toast.success(editingId ? "Lecture updated!" : "Lecture added!");
        closeForm();
        fetchLectures();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => {
      setIsFormOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Video className="text-yellow-400" size={28} />
              Lecture Manager
            </h2>
            <p className="text-gray-400 text-xs mt-1">Organize course content</p>
         </div>
         <button 
           onClick={() => setIsFormOpen(true)}
           className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-400/20 text-sm"
         >
           <Plus size={16} /> Add Lecture
         </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" size={40} /></div>
      ) : (
        <div className="space-y-3">
           {lectures.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-[#111] rounded-xl border border-dashed border-white/10">
                   <Video size={32} className="mx-auto mb-2 opacity-50"/>
                   <p className="text-sm">No lectures yet.</p>
                </div>
           )}

           {lectures.map((lecture) => (
               <motion.div 
                 key={lecture._id}
                 layout
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="group bg-[#111] border border-white/10 hover:border-yellow-400/50 p-3 rounded-xl flex flex-col md:flex-row gap-4 transition-all"
               >
                  {/* Thumbnail in List */}
                  <div className="relative w-full md:w-40 aspect-video bg-black rounded-lg overflow-hidden shrink-0 border border-white/5">
                     <img src={lecture.thumbnailUrl || "/placeholder.jpg"} alt="thumb" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                     <div className="absolute top-1 left-1 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1">
                        <BookOpen size={9} className="text-yellow-400"/> {lecture.bookName || "Gen"}
                     </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center">
                     <div className="flex justify-between items-start">
                         <div>
                            <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                <Layers size={10}/> {lecture.chapter}
                            </span>
                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">{lecture.title}</h3>
                         </div>
                     </div>
                     
                     <div className="flex items-center gap-2 mt-2">
                        {lecture.resourceUrl && (
                           <a href={lecture.resourceUrl} target="_blank" className="text-[10px] font-bold text-green-400 flex items-center gap-1 hover:underline bg-green-400/10 px-2 py-1 rounded-md">
                              <Download size={10}/> Resource
                           </a>
                        )}
                        <div className="flex-1"></div>
                        
                        <button onClick={() => handleEdit(lecture)} className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            <Edit2 size={12}/>
                        </button>
                        <button onClick={() => handleDelete(lecture._id)} className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                            <Trash2 size={12}/>
                        </button>
                     </div>
                  </div>
               </motion.div>
             ))}
        </div>
      )}

      {/* COMPACT CARD MODAL - FIXED FOR PC */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               // HERE IS THE FIX: max-w-md enforces mobile width on ALL screens
               className="bg-[#0f0f0f] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[85vh]"
             >
                {/* Header */}
                <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-[#141414]">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     {editingId ? <Edit2 size={14} className="text-yellow-400"/> : <Plus size={14} className="text-yellow-400"/>}
                     {editingId ? "Edit Lecture" : "Add New Lecture"}
                   </h3>
                   <button onClick={closeForm} className="text-gray-400 hover:text-white bg-white/5 p-1 rounded-full"><X size={16}/></button>
                </div>
                
                {/* Scrollable Form Body */}
                <div className="overflow-y-auto p-5 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-3">
                    
                    {/* URL Input */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                            Video Link
                            {fetchingMeta && <span className="text-yellow-400 text-[9px] animate-pulse">fetching...</span>}
                        </label>
                        <div className="relative">
                            <input 
                              type="text" 
                              placeholder="YouTube Link..."
                              className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none transition-all"
                              value={formData.videoUrl}
                              onChange={handleUrlPaste}
                              required
                            />
                            <Video className="absolute left-2.5 top-2.5 text-gray-500" size={14}/>
                        </div>
                    </div>

                    {/* Thumbnail Logic: Input + Preview */}
                    <div className="flex gap-3 items-start p-2 bg-white/5 rounded-lg border border-white/5">
                        {/* Preview */}
                        <div className="w-20 aspect-video bg-black rounded overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
                            {formData.thumbnailUrl ? (
                                <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover"/>
                            ) : (
                                <ImageIcon size={16} className="text-gray-600"/>
                            )}
                        </div>
                        {/* Manual Input */}
                        <div className="flex-1 space-y-1">
                             <label className="text-[9px] font-bold text-gray-400 uppercase">Thumbnail URL (Auto/Edit)</label>
                             <input 
                                type="text" 
                                className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded px-2 py-1 text-[10px] text-gray-300 outline-none"
                                placeholder="Paste image link..."
                                value={formData.thumbnailUrl || ""}
                                onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                             />
                        </div>
                    </div>

                    {/* Chapter & Book (Side by Side) */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Chapter</label>
                            <input 
                                type="text" 
                                className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                placeholder="e.g. Ch 1"
                                value={formData.chapter}
                                onChange={e => setFormData({...formData, chapter: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Book</label>
                            <input 
                                type="text" 
                                className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                placeholder="e.g. Physics"
                                value={formData.bookName}
                                onChange={e => setFormData({...formData, bookName: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Lecture Title</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-lg px-3 py-2 text-xs text-white outline-none font-medium"
                            placeholder="Enter title..."
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                        <textarea 
                            rows="2"
                            className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                            placeholder="Short summary..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    {/* Resource Link */}
                    <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-400 uppercase">Resource / PDF Link</label>
                         <div className="relative">
                            <input 
                                type="text" 
                                className="w-full bg-black/50 border border-white/10 focus:border-green-400 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none"
                                placeholder="Download URL"
                                value={formData.resourceUrl}
                                onChange={e => setFormData({...formData, resourceUrl: e.target.value})}
                            />
                            <Download className="absolute left-2.5 top-2.5 text-green-500" size={12}/>
                         </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={saving}
                        type="submit" 
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-lg shadow-yellow-400/10 text-xs uppercase tracking-wide"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                        {saving ? "Processing..." : (editingId ? "Save Changes" : "Add Lecture")}
                    </button>
                    </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
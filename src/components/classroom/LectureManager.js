"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Plus, Trash2, Edit2, Download, 
  ExternalLink, Loader2, Sparkles, X, BookOpen, Layers, Image as ImageIcon, Search
} from "lucide-react";
import toast from "react-hot-toast";

export default function LectureManager({ courseId }) {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]); // For Search
  const [searchQuery, setSearchQuery] = useState(""); // Search State
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

  // Search Logic
  useEffect(() => {
    if (!searchQuery) {
      setFilteredLectures(lectures);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = lectures.filter(item => 
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.chapter?.toLowerCase().includes(lowerQuery) ||
        item.bookName?.toLowerCase().includes(lowerQuery)
      );
      setFilteredLectures(filtered);
    }
  }, [searchQuery, lectures]);

  const fetchLectures = async () => {
    try {
      const res = await fetch(`/api/admin/lectures?courseId=${courseId}`);
      const data = await res.json();
      if (data.lectures) {
        setLectures(data.lectures);
        setFilteredLectures(data.lectures);
      }
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
         <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Video className="text-yellow-400" size={32} />
              Lecture Manager
            </h2>
            <p className="text-gray-400 text-sm mt-1">Manage and organize your course videos</p>
         </div>

         <div className="flex w-full md:w-auto gap-3 flex-col md:flex-row">
           {/* Search Input */}
           <div className="relative group w-full md:w-80">
              <input 
                type="text"
                placeholder="Search by Title, Chapter or Book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 group-hover:border-yellow-400/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:ring-2 ring-yellow-400/20 transition-all"
              />
              <Search className="absolute left-3 top-3 text-gray-500 group-hover:text-yellow-400 transition-colors" size={16} />
           </div>

           <button 
             onClick={() => setIsFormOpen(true)}
             className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-400/20 text-sm md:text-base whitespace-nowrap"
           >
             <Plus size={20} /> Add Lecture
           </button>
         </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" size={48} /></div>
      ) : (
        <div className="space-y-4">
           {filteredLectures.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-[#111] rounded-2xl border border-dashed border-white/10">
                   {searchQuery ? (
                     <>
                       <Search size={40} className="mx-auto mb-3 opacity-50"/>
                       <p className="text-base">No matches found for "{searchQuery}"</p>
                     </>
                   ) : (
                     <>
                        <Video size={40} className="mx-auto mb-3 opacity-50"/>
                        <p className="text-base">No lectures yet. Add your first video!</p>
                     </>
                   )}
                </div>
           )}

           {filteredLectures.map((lecture) => (
               <motion.div 
                 key={lecture._id}
                 layout
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="group bg-[#111] border border-white/10 hover:border-yellow-400/50 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row gap-5 md:gap-8 transition-all"
               >
                  {/* Thumbnail Section - Bigger on PC */}
                  <div className="relative w-full md:w-72 aspect-video bg-black rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-lg">
                     <img src={lecture.thumbnailUrl || "/placeholder.jpg"} alt="thumb" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>
                     
                     {/* Overlay Badge */}
                     <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-1 rounded-md text-[10px] md:text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
                        <BookOpen size={10} className="text-yellow-400"/> {lecture.bookName || "General"}
                     </div>
                  </div>

                  {/* Content Section - More Details & Bigger Text */}
                  <div className="flex-1 flex flex-col justify-start md:justify-center py-1">
                     <div className="flex flex-col gap-1 mb-2">
                        {/* Tags Row */}
                        <div className="flex items-center gap-3">
                           <span className="bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                              <Layers size={12}/> {lecture.chapter}
                           </span>
                           {lecture.isPreview && (
                             <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider">
                               Preview
                             </span>
                           )}
                        </div>
                        
                        {/* Title - Bigger on PC */}
                        <h3 className="text-base md:text-xl font-bold text-white leading-tight mt-1">{lecture.title}</h3>
                        
                        {/* Description - Added line clamp */}
                        {lecture.description && (
                          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-1 line-clamp-2 md:line-clamp-2">
                            {lecture.description}
                          </p>
                        )}
                     </div>
                     
                     <div className="mt-auto pt-3 flex items-center gap-3">
                        {lecture.resourceUrl && (
                           <a href={lecture.resourceUrl} target="_blank" className="text-xs md:text-sm font-bold text-green-400 flex items-center gap-2 hover:underline bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20 transition-colors">
                              <Download size={14}/> Resource Material
                           </a>
                        )}
                        <div className="flex-1"></div>
                        
                        {/* Action Buttons - Larger touch targets */}
                        <button onClick={() => handleEdit(lecture)} className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs md:text-sm font-medium">
                            <Edit2 size={14}/> Edit
                        </button>
                        <button onClick={() => handleDelete(lecture._id)} className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-xs md:text-sm font-medium">
                            <Trash2 size={14}/> Delete
                        </button>
                     </div>
                  </div>
               </motion.div>
             ))}
        </div>
      )}

      {/* MODAL - WIDER ON PC */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               // Increased max-width for PC: max-w-md -> md:max-w-3xl
               className="bg-[#0f0f0f] border border-white/10 w-full max-w-md md:max-w-3xl rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[90vh]"
             >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#141414]">
                   <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                     {editingId ? <Edit2 size={18} className="text-yellow-400"/> : <Plus size={18} className="text-yellow-400"/>}
                     {editingId ? "Edit Lecture Details" : "Add New Lecture"}
                   </h3>
                   <button onClick={closeForm} className="text-gray-400 hover:text-white bg-white/5 p-1.5 rounded-full hover:bg-white/10 transition-colors"><X size={20}/></button>
                </div>
                
                {/* Scrollable Form Body */}
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* URL Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                            Video Link
                            {fetchingMeta && <span className="text-yellow-400 text-[10px] animate-pulse flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Fetching data...</span>}
                        </label>
                        <div className="relative">
                            <input 
                              type="text" 
                              placeholder="Paste YouTube Link here..."
                              className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all focus:bg-black"
                              value={formData.videoUrl}
                              onChange={handleUrlPaste}
                              required
                            />
                            <Video className="absolute left-3.5 top-3.5 text-gray-500" size={16}/>
                        </div>
                    </div>

                    {/* Desktop Layout: Split Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Left Column */}
                        <div className="space-y-5">
                             {/* Thumbnail */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase">Thumbnail Preview</label>
                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 group">
                                    {formData.thumbnailUrl ? (
                                        <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                            <ImageIcon size={32} className="mb-2"/>
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}
                                    <input 
                                        type="text" 
                                        className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur px-3 py-2 text-[10px] text-gray-300 outline-none border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        placeholder="Paste custom thumbnail URL..."
                                        value={formData.thumbnailUrl || ""}
                                        onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Resource Link */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase">Resource / PDF Link</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/50 border border-white/10 focus:border-green-400 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none"
                                        placeholder="Drive/Download URL"
                                        value={formData.resourceUrl}
                                        onChange={e => setFormData({...formData, resourceUrl: e.target.value})}
                                    />
                                    <Download className="absolute left-3 top-3 text-green-500" size={14}/>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                             {/* Chapter & Book */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Chapter No.</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                                        placeholder="e.g. Ch 01"
                                        value={formData.chapter}
                                        onChange={e => setFormData({...formData, chapter: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Book / Subject</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                                        placeholder="e.g. Physics"
                                        value={formData.bookName}
                                        onChange={e => setFormData({...formData, bookName: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase">Lecture Title</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-medium"
                                    placeholder="Enter full video title..."
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                                <textarea 
                                    rows="3"
                                    className="w-full bg-black/50 border border-white/10 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
                                    placeholder="What is this lecture about?"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button 
                            disabled={saving}
                            type="submit" 
                            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-400/10 text-sm uppercase tracking-wide"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18}/>}
                            {saving ? "Saving Changes..." : (editingId ? "Update Lecture" : "Add Lecture")}
                        </button>
                    </div>
                    </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
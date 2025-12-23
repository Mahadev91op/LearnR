"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Trash2, Plus, X, AlertCircle, Pin } from "lucide-react";
import { toast } from "react-hot-toast"; // Assuming you have react-hot-toast or use your Toast component

// --- CREATE NOTICE MODAL COMPONENT ---
const AddNoticeModal = ({ isOpen, onClose, courseId, onNoticeAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    durationHours: "24", // Default 1 day
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notice/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, courseId }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Notice Posted & Emails Sent!");
        onNoticeAdded();
        onClose();
        setFormData({ title: "", content: "", priority: "medium", durationHours: "24" });
      } else {
        toast.error(data.error || "Failed to post notice");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-yellow-400 text-black p-1 rounded"><Plus size={16}/></span> Create New Notice
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Title</label>
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
              placeholder="e.g., Exam Rescheduled"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Notice Content</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none resize-none"
              placeholder="Write the details here..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Disappears After</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"
                value={formData.durationHours}
                onChange={(e) => setFormData({...formData, durationHours: e.target.value})}
              >
                <option value="1">1 Hour</option>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (1 Day)</option>
                <option value="48">48 Hours (2 Days)</option>
                <option value="168">7 Days</option>
              </select>
            </div>
            <div>
               <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Priority</label>
               <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Low Info</option>
                <option value="medium">Medium</option>
                <option value="high">High / Urgent</option>
              </select>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Sending Emails..." : "Post Notice"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- MAIN NOTICE BOARD UI ---
export default function NoticeBoard({ courseId, isAdmin = false }) {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/notices`);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [courseId]);

  // Determine styles based on priority
  const getPriorityStyles = (p) => {
    switch(p) {
      case 'high': return "border-l-4 border-l-red-500 bg-red-500/5";
      case 'low': return "border-l-4 border-l-blue-500 bg-blue-500/5";
      default: return "border-l-4 border-l-yellow-400 bg-yellow-400/5";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-[500px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <Bell className="text-yellow-400 fill-yellow-400" /> Notice Board
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Important announcements and updates for this class.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Notice
          </button>
        )}
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111] rounded-3xl border border-white/5 border-dashed">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
              <Bell size={30} />
           </div>
           <p className="text-gray-400 font-medium">No active notices right now.</p>
           <p className="text-gray-600 text-sm mt-1">Check back later for updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {notices.map((notice) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-6 rounded-xl border border-white/10 relative overflow-hidden group ${getPriorityStyles(notice.priority)}`}
              >
                 <div className="flex justify-between items-start">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">{notice.title}</h3>
                          {notice.priority === 'high' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Urgent</span>}
                       </div>
                       <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{notice.content}</p>
                       
                       <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1"><Clock size={14}/> Posted: {new Date(notice.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 text-yellow-500"><AlertCircle size={14}/> Expires: {new Date(notice.expireAt).toLocaleString()}</span>
                       </div>
                    </div>
                    
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                       <Pin className="text-white transform rotate-45" size={24} />
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AddNoticeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        onNoticeAdded={fetchNotices}
      />
    </div>
  );
}
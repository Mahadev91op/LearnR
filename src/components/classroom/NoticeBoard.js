"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Trash2, Plus, X, AlertCircle, Pin, ChevronDown, Check, Send } from "lucide-react";
import { toast } from "react-hot-toast"; 

// --- CUSTOM DROPDOWN COMPONENT (To fix PC visibility & improve design) ---
const CustomSelect = ({ label, value, options, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || "Select";

  return (
    <div className="relative" ref={ref}>
      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 block ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#1A1A1A] border ${isOpen ? 'border-yellow-400' : 'border-white/10'} rounded-xl p-3 flex items-center justify-between text-white transition-all duration-200 hover:bg-white/5 active:scale-[0.98]`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {Icon && <Icon size={16} className="text-gray-400" />}
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-white/5 transition-colors ${value === opt.value ? 'text-yellow-400 bg-yellow-400/5' : 'text-gray-300'}`}
              >
                {opt.label}
                {value === opt.value && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- CREATE NOTICE MODAL COMPONENT ---
const AddNoticeModal = ({ isOpen, onClose, courseId, onNoticeAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    durationHours: "24",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
        toast.error("Please fill all fields");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/notice/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, courseId }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Notice Posted Successfully!");
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#0f0f0f] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl w-full max-w-md relative shadow-2xl overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/10 blur-[50px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
           <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                New Notice
              </h2>
              <p className="text-xs text-gray-500 font-medium">Notify all students instantly</p>
           </div>
           <button 
             onClick={onClose} 
             className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
           >
             <X size={16}/>
           </button>
        </div>

        {/* Form */}
        <div className="p-6 pt-4 space-y-5">
          {/* Title Input */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 block ml-1">Title</label>
            <input 
              required
              autoFocus
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600 focus:border-yellow-400 focus:bg-[#1A1A1A] outline-none transition-all text-sm font-medium"
              placeholder="Ex: Class Rescheduled"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          {/* Content Input */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 block ml-1">Details</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600 focus:border-yellow-400 focus:bg-[#1A1A1A] outline-none resize-none transition-all text-sm leading-relaxed"
              placeholder="What's the update about?"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          {/* Custom Dropdowns Row */}
          <div className="grid grid-cols-2 gap-3">
             <CustomSelect 
                label="Duration"
                value={formData.durationHours}
                onChange={(val) => setFormData({...formData, durationHours: val})}
                icon={Clock}
                options={[
                    { value: "1", label: "1 Hour" },
                    { value: "6", label: "6 Hours" },
                    { value: "12", label: "12 Hours" },
                    { value: "24", label: "1 Day" },
                    { value: "48", label: "2 Days" },
                    { value: "168", label: "7 Days" },
                ]}
             />
             <CustomSelect 
                label="Priority"
                value={formData.priority}
                onChange={(val) => setFormData({...formData, priority: val})}
                icon={AlertCircle}
                options={[
                    { value: "low", label: "Low Info" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "Urgent" },
                ]}
             />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-yellow-400/20"
          >
            {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
                <>
                 <Send size={18} /> Post Notice
                </>
            )}
          </button>
        </div>
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
      // Corrected URL: added '/admin' to match your folder structure
      const res = await fetch(`/api/admin/courses/${courseId}/notices`);
      
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      if (data.success) {
        setNotices(data.notices);
      }
    } catch (error) {
      console.error("Failed to fetch notices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
        fetchNotices();
    }
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

      {/* Improved Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <AddNoticeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                courseId={courseId}
                onNoticeAdded={fetchNotices}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
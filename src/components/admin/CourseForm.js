"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function CourseForm({ existingData, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: existingData?.title || "",
    description: existingData?.description || "",
    price: existingData?.price || "",
    duration: existingData?.duration || "",
    level: existingData?.level || "Beginner",
    category: existingData?.category || "",
    gradient: existingData?.gradient || "from-blue-500 to-purple-600",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = existingData 
      ? `/api/admin/courses/${existingData._id}` 
      : "/api/admin/courses";
    
    const method = existingData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        alert("Operation failed!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {existingData ? "Edit Course" : "Add New Course"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent" 
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input required type="number" className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent" 
                  value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Description</label>
             <textarea required rows="3" className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent" 
               value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Duration (e.g., 3 Months)</label>
                <input required type="text" className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent" 
                  value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent"
                  value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 12">Class 12</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input required type="text" placeholder="e.g. Science" className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent" 
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Gradient Class (Tailwind)</label>
                <input required type="text" placeholder="from-x-500 to-y-500" className="w-full p-2 rounded-lg border focus:ring-2 ring-indigo-500 bg-transparent" 
                  value={formData.gradient} onChange={(e) => setFormData({...formData, gradient: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
            <button disabled={loading} type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg flex items-center">
              {loading ? "Saving..." : (existingData ? "Update Course" : "Create Course")}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, BookOpen } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Courses
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      fetchCourses();
    } catch (err) {
      alert("Error deleting course");
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 lg:p-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-indigo-500" /> Course Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your platform's learning content efficiently.</p>
        </div>
        <button 
          onClick={() => { setEditingCourse(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95 font-medium"
        >
          <Plus size={20} /> Add New Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8 relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by title or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 ring-indigo-500 outline-none shadow-sm transition-all"
        />
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`h-32 bg-gradient-to-r ${course.gradient} relative p-6 flex flex-col justify-end`}>
                 <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                   {course.category}
                 </span>
                 <h3 className="text-2xl font-bold text-white drop-shadow-md truncate">{course.title}</h3>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{course.level}</span>
                    <span>{course.duration}</span>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-800">
                   <div className="text-lg font-bold text-indigo-600">₹{course.price}</div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingCourse(course); setIsFormOpen(true); }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(course._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isLoading && <div className="text-center py-20 text-gray-500">Loading courses...</div>}
      {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20 text-gray-500">No courses found. Add one!</div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <CourseForm 
          existingData={editingCourse} 
          onClose={() => setIsFormOpen(false)} 
          onRefresh={fetchCourses} 
        />
      )}
    </div>
  );
}
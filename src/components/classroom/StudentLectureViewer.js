"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Youtube, Download, Search, 
  ArrowLeft, Clock, BookOpen, Layers, MonitorPlay 
} from "lucide-react";
import toast from "react-hot-toast";

export default function StudentLectureViewer({ courseId }) {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null); // For Details View
  const [isPlaying, setIsPlaying] = useState(false); // For "Watch Here"

  // Fetch Lectures
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/lectures`);
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
    if (courseId) fetchLectures();
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

  // Helper to get YouTube Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: LECTURE LIST */}
        {!selectedLecture ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
                  Course <span className="text-yellow-400">Lectures</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base">Explore your syllabus and start learning.</p>
              </div>

              {/* Modern Search Bar */}
              <div className="relative group w-full md:w-96">
                <input 
                  type="text"
                  placeholder="Search topic, chapter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 group-hover:border-yellow-400/50 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all placeholder:text-gray-600"
                />
                <Search className="absolute left-4 top-4 text-gray-500 group-hover:text-yellow-400 transition-colors" size={20} />
              </div>
            </div>

            {/* Grid List */}
            {loading ? (
              <div className="text-center py-20 text-gray-500 animate-pulse">Loading content...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredLectures.map((lecture, index) => (
                   <motion.div 
                     key={lecture._id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: index * 0.05 }}
                     onClick={() => {
                        setSelectedLecture(lecture);
                        setIsPlaying(false);
                     }}
                     className="group bg-[#111] border border-white/5 hover:border-yellow-400/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:shadow-yellow-400/10"
                   >
                      {/* Thumbnail Area */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                         <img 
                           src={lecture.thumbnailUrl || "/placeholder.jpg"} 
                           alt={lecture.title}
                           className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
                         
                         {/* Play Button Overlay */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                            <div className="bg-yellow-400 text-black rounded-full p-4 shadow-xl shadow-yellow-400/20">
                               <Play fill="currentColor" size={24}/>
                            </div>
                         </div>

                         {/* Badges */}
                         <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-black/60 backdrop-blur border border-white/10 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                               <Layers size={10} className="text-yellow-400"/> {lecture.chapter}
                            </span>
                         </div>
                         <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                            <Clock size={12}/> 24:00
                         </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                         <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                            <BookOpen size={12}/> {lecture.bookName || "General"}
                         </div>
                         <h3 className="text-lg font-bold text-white leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2">
                            {lecture.title}
                         </h3>
                         <p className="text-gray-500 text-sm line-clamp-2">
                            {lecture.description || "No description available for this lecture."}
                         </p>
                      </div>
                   </motion.div>
                 ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* VIEW 2: DETAILS & PLAYER (Netflix Style) */
          <motion.div 
            key="details"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="max-w-6xl mx-auto"
          >
             {/* Back Button */}
             <button 
               onClick={() => setSelectedLecture(null)}
               className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
             >
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform"/> Back to Lectures
             </button>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Player Area (Takes 2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                   {/* Main Player Container */}
                   <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-yellow-400/5 group">
                      {isPlaying ? (
                         <iframe 
                           src={getEmbedUrl(selectedLecture.videoUrl)} 
                           className="w-full h-full"
                           allowFullScreen
                           title={selectedLecture.title}
                           allow="autoplay; encrypted-media"
                         />
                      ) : (
                         <>
                            <img 
                              src={selectedLecture.thumbnailUrl || "/placeholder.jpg"} 
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"/>
                            
                            {/* Big Play Button */}
                            <button 
                              onClick={() => setIsPlaying(true)}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full p-6 md:p-8 transition-all hover:scale-110 shadow-[0_0_40px_rgba(250,204,21,0.4)]"
                            >
                               <Play fill="currentColor" size={32} md-size={48} />
                            </button>
                         </>
                      )}
                   </div>

                   {/* Video Meta */}
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs md:text-sm border border-yellow-400/20 px-2 py-1 rounded">
                            {selectedLecture.chapter}
                         </span>
                         <span className="text-gray-500 text-sm font-medium">{selectedLecture.bookName}</span>
                      </div>
                      <h1 className="text-2xl md:text-4xl font-black text-white mb-3">{selectedLecture.title}</h1>
                      <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                         {selectedLecture.description || "Dive deep into this topic with our comprehensive video lecture. Make sure to check the resources below."}
                      </p>
                   </div>
                </div>

                {/* Right: Actions & Details (Takes 1 column) */}
                <div className="space-y-6">
                   <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 sticky top-8">
                      <h3 className="text-xl font-bold text-white mb-2">Actions</h3>
                      
                      {/* BUTTON 1: WATCH HERE (Internal Player) */}
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${isPlaying ? 'bg-white/10 text-white cursor-default' : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20'}`}
                      >
                         <MonitorPlay size={20} />
                         {isPlaying ? "Now Playing" : "Watch Here"}
                      </button>

                      {/* BUTTON 2: WATCH ON YOUTUBE */}
                      <a 
                        href={selectedLecture.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-500/20"
                      >
                         <Youtube size={20} fill="currentColor" />
                         Watch on YouTube
                      </a>

                      {/* BUTTON 3: DOWNLOAD RESOURCE */}
                      {selectedLecture.resourceUrl ? (
                         <a 
                           href={selectedLecture.resourceUrl}
                           target="_blank"
                           className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-white/10 hover:border-green-500/50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all group"
                         >
                            <Download size={20} className="text-gray-500 group-hover:text-green-400 transition-colors"/>
                            Download Material
                         </a>
                      ) : (
                         <button disabled className="w-full bg-white/5 text-gray-600 py-4 rounded-xl font-bold flex items-center justify-center gap-3 cursor-not-allowed">
                            <Download size={20} />
                            No Material
                         </button>
                      )}

                      <div className="pt-6 border-t border-white/10">
                         <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Next Up</h4>
                         <div className="space-y-3">
                            {/* Simple Next Up List (Demo) */}
                            {filteredLectures.slice(0, 3).map(l => (
                               <div key={l._id} onClick={() => {setSelectedLecture(l); setIsPlaying(false);}} className="flex gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                  <div className="w-16 h-10 bg-gray-800 rounded overflow-hidden shrink-0">
                                     <img src={l.thumbnailUrl} className="w-full h-full object-cover"/>
                                  </div>
                                  <div className="min-w-0">
                                     <p className="text-sm text-white font-medium truncate">{l.title}</p>
                                     <p className="text-xs text-gray-500">{l.chapter}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
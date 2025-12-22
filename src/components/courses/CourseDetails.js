"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CourseDetails({ course }) {
  const [activeTab, setActiveTab] = useState("overview");

  // --- ICONS FOR MOBILE TABS (SVG) ---
  const tabIcons = {
    overview: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    "demo videos": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    "demo notes": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    syllabus: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    ),
    reviews: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    )
  };

  // --- FAKE DATA (Unchanged) ---
  const syllabus = [
    { title: "Introduction & Basics", topics: ["Understanding Grammar", "Sentence Structure", "Parts of Speech"] },
    { title: "Advanced Concepts", topics: ["Active vs Passive Voice", "Direct Indirect Speech", "Tenses Mastery"] },
    { title: "Practical Application", topics: ["Essay Writing", "Public Speaking", "Debate Skills"] },
  ];

  const demoVideos = [
    { title: "Course Introduction", duration: "10:05", thumbnail: "bg-gradient-to-br from-purple-600 to-blue-600" },
    { title: "Chapter 1: The Basics", duration: "45:20", thumbnail: "bg-gradient-to-br from-pink-600 to-rose-600" },
    { title: "Live Class Recording", duration: "1:02:00", thumbnail: "bg-gradient-to-br from-yellow-600 to-orange-600" },
  ];

  const demoNotes = [
    { title: "Chapter 1 Summary", size: "1.2 MB", type: "PDF" },
    { title: "Grammar Cheat Sheet", size: "850 KB", type: "PDF" },
    { title: "Practice Worksheet", size: "2.4 MB", type: "DOCX" },
  ];

  const features = [
    { icon: "🎥", title: "HD Live & Recorded", desc: "Interactive classes with high quality." },
    { icon: "📚", title: "Smart Study Material", desc: "Curated notes for easy learning." },
    { icon: "⚡", title: "Doubt Solving", desc: "Instant doubt clearance support." },
    { icon: "🏆", title: "Weekly Tests", desc: "Track your progress regularly." },
  ];

  const tabs = ['overview', 'demo videos', 'demo notes', 'syllabus', 'reviews'];

  return (
    <div className="relative min-h-screen bg-black pb-24 font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      
      {/* --- DYNAMIC BACKGROUND GLOW (OPTIMIZED FOR MOBILE) --- */}
      {/* Changes: Added 'transform-gpu' and reduced blur on mobile to fix lag */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute top-[-20%] left-[-20%] w-[800px] h-[800px] rounded-full mix-blend-screen blur-[80px] md:blur-[150px] opacity-15 bg-gradient-to-br ${course.gradient || 'from-yellow-500 to-orange-500'} transform-gpu will-change-transform`}></div>
          <div className={`absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full mix-blend-screen blur-[80px] md:blur-[150px] opacity-10 bg-gradient-to-tl ${course.gradient || 'from-yellow-500 to-orange-500'} transform-gpu will-change-transform`}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-16 overflow-hidden z-10">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md mb-6 md:mb-8 shadow-[0_0_20px_-5px_rgba(234,179,8,0.2)]">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-bold text-yellow-400 uppercase tracking-widest">
                {course.category} • {course.level}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.1] tracking-tight">
              {course.title}
            </h1>
            <p className="text-gray-400 text-sm md:text-xl leading-relaxed mb-6 md:mb-8 max-w-xl">
              {course.description}
            </p>

            {/* Meta Stats */}
            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-300">
              <div className="flex items-center gap-1.5 md:gap-2 bg-white/5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-white/5 backdrop-blur-sm">
                <span>⏱</span> <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 bg-white/5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-white/5 backdrop-blur-sm">
                <span>⭐</span> <span className="font-semibold">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 bg-white/5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-white/5 backdrop-blur-sm">
                <span>👥</span> <span className="font-semibold">{course.students}+</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Video/Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 aspect-video group cursor-pointer hover:border-yellow-500/30 transition-all duration-500 transform-gpu">
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all z-20">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500 rounded-full flex items-center justify-center pl-1 shadow-lg">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                   </div>
                </div>
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${course.gradient || 'from-gray-800 to-black'}`}></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
                   <p className="text-[10px] md:text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Preview</p>
                   <p className="text-white font-medium text-xs md:text-base">Watch Introduction</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT & STICKY SIDEBAR --- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-4 md:mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
            
            {/* LEFT COLUMN: TABS & CONTENT */}
            <div className="lg:col-span-2">
               
               {/* CUSTOM TAB NAVIGATION */}
               {/* Optimization: Reduced backdrop blur on mobile to prevent scroll lag */}
               <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-md md:backdrop-blur-xl border-b border-white/10 mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-xl md:border md:top-24 shadow-lg md:shadow-none transition-all">
                 <div className="flex justify-between md:justify-start md:overflow-x-auto md:no-scrollbar">
                   {tabs.map((tab) => (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`relative flex-1 md:flex-none flex items-center justify-center py-3 md:px-6 md:py-4 transition-colors outline-none
                         ${activeTab === tab ? "text-yellow-400" : "text-gray-500 hover:text-white"}`}
                     >
                       {/* Mobile: Only Icon */}
                       <span className="block md:hidden text-lg transform-gpu">
                          {tabIcons[tab]}
                       </span>

                       {/* Desktop: Only Text */}
                       <span className="hidden md:block text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                          {tab}
                       </span>

                       {/* Active Indicator */}
                       {activeTab === tab && (
                         <motion.div 
                           layoutId="activeTab"
                           className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] mx-auto w-full md:w-auto"
                         />
                       )}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Tab Content Area */}
               <div className="min-h-[400px]">
                 <AnimatePresence mode="wait">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                       <motion.div 
                          key="overview"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="space-y-6 md:space-y-8"
                       >
                          <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
                             <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Why this course?</h3>
                             <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                {features.map((feature, i) => (
                                   <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                      <span className="text-2xl md:text-3xl">{feature.icon}</span>
                                      <div>
                                         <h4 className="font-bold text-white text-sm md:text-base mb-0.5">{feature.title}</h4>
                                         <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                          
                          <div className="prose prose-invert prose-sm md:prose-lg max-w-none px-2 md:px-0">
                             <h3 className="text-white">Detailed Description</h3>
                             <p className="text-gray-400">
                                This comprehensive course on <strong>{course.title}</strong> is carefully designed to take you from a {course.level} level to an advanced understanding. 
                                We focus on concept clarity and practical application.
                             </p>
                          </div>
                       </motion.div>
                    )}

                    {/* DEMO VIDEOS TAB */}
                    {activeTab === 'demo videos' && (
                        <motion.div 
                           key="videos"
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                           className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {demoVideos.map((video, idx) => (
                                <div key={idx} className="group relative bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all cursor-pointer transform-gpu">
                                    <div className={`h-36 md:h-40 w-full ${video.thumbnail} flex items-center justify-center relative`}>
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                                            {video.duration}
                                        </span>
                                    </div>
                                    <div className="p-3 md:p-4">
                                        <h4 className="font-bold text-white text-xs md:text-sm mb-1 line-clamp-1">{video.title}</h4>
                                        <p className="text-[10px] md:text-xs text-gray-500">Free Preview</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* DEMO NOTES TAB */}
                    {activeTab === 'demo notes' && (
                        <motion.div 
                           key="notes"
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                           className="space-y-3"
                        >
                            {demoNotes.map((note, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-gray-900 border border-white/10 rounded-xl md:rounded-2xl hover:border-yellow-500/30 transition-all group">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/10 text-red-500 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl font-bold">
                                            PDF
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-xs md:text-sm">{note.title}</h4>
                                            <p className="text-[10px] md:text-xs text-gray-500">{note.size} • {note.type}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-yellow-500 hover:text-black transition-all">
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* SYLLABUS TAB */}
                    {activeTab === 'syllabus' && (
                       <motion.div 
                          key="syllabus"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="space-y-3 md:space-y-4"
                       >
                          {syllabus.map((module, idx) => (
                             <div key={idx} className="bg-gray-900/50 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden">
                                <div className="p-4 md:p-5 flex justify-between items-center bg-white/5">
                                   <h4 className="font-bold text-white text-xs md:text-base pr-4">
                                       <span className="text-yellow-500 mr-2 block md:inline">Module {idx + 1}:</span> 
                                       {module.title}
                                   </h4>
                                   <span className="text-[10px] md:text-xs font-mono text-gray-400 bg-black/30 px-2 py-1 rounded whitespace-nowrap">{module.topics.length} Lessons</span>
                                </div>
                                <div className="p-4 md:p-5 space-y-2 md:space-y-3">
                                   {module.topics.map((topic, i) => (
                                      <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                                         <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-gray-600 flex-shrink-0"></div>
                                         {topic}
                                      </div>
                                   ))}
                                </div>
                             </div>
                          ))}
                       </motion.div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                       <motion.div 
                          key="reviews"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="text-center py-10 md:py-12 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5 border-dashed"
                       >
                          <div className="text-3xl md:text-4xl mb-2">💬</div>
                          <h3 className="text-base md:text-lg font-bold text-white">Student Reviews</h3>
                          <p className="text-gray-400 text-xs md:text-sm mt-1">Reviews section is coming soon!</p>
                       </motion.div>
                    )}
                 </AnimatePresence>
               </div>
            </div>

            {/* RIGHT COLUMN: STICKY PRICING CARD */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
               <div className="sticky top-28">
                  <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl overflow-hidden transform-gpu">
                      
                      {/* Decorative Gradient Blob */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none"></div>

                      <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-md mb-4 border border-green-500/20">
                            Most Popular Plan
                        </span>

                        <h3 className="text-gray-400 text-xs md:text-sm font-medium mb-1">Monthly Subscription</h3>
                        <div className="flex items-baseline gap-1 mb-5 md:mb-6">
                            <span className="text-3xl md:text-4xl font-black text-white">₹{course.price}</span>
                            <span className="text-gray-500 text-xs md:text-sm font-medium">/ month</span>
                        </div>

                        {/* Animated Button */}
                        <button className="group relative w-full overflow-hidden rounded-xl bg-yellow-500 p-3 md:p-4 transition-all hover:bg-yellow-400 active:scale-[0.98] shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] mb-5 md:mb-6 transform-gpu">
                           <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"></div>
                           <span className="relative z-20 text-black font-black text-base md:text-lg uppercase tracking-wide flex items-center justify-center gap-2">
                             Enroll Now 
                             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                           </span>
                        </button>

                        <div className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-400 border-t border-white/10 pt-5 md:pt-6">
                            <p className="font-medium text-white mb-2">This plan includes:</p>
                            
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px]">✓</div>
                                <p>Access until <span className="text-yellow-100">2 months</span> after course completion</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px]">✓</div>
                                <p>Live Q&A Sessions & Doubt Solving</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px]">✓</div>
                                <p>All Study Material & Recordings</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-[10px]">✓</div>
                                <p>Certificate of Completion</p>
                            </div>
                        </div>

                        <div className="mt-5 md:mt-6 pt-4 border-t border-white/5 text-center">
                            <Link href="/contact" className="text-xs text-gray-500 hover:text-white underline transition-colors">
                                Have questions? Talk to us
                            </Link>
                        </div>
                      </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-[10px] md:text-xs">
                     <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                     <span>Secure Payment via UPI/Card</span>
                  </div>
               </div>
            </div>

        </div>
      </section>
    </div>
  );
}
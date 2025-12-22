"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CourseDetails({ course }) {
  const [activeTab, setActiveTab] = useState("overview");

  // --- FAKE DATA (Database me ye fields nahi hai isliye hardcode kiya hai) ---
  const syllabus = [
    { title: "Introduction & Basics", topics: ["Understanding Grammar", "Sentence Structure", "Parts of Speech"] },
    { title: "Advanced Concepts", topics: ["Active vs Passive Voice", "Direct Indirect Speech", "Tenses Mastery"] },
    { title: "Practical Application", topics: ["Essay Writing", "Public Speaking", "Debate Skills"] },
  ];

  const features = [
    { icon: "🎥", title: "HD Video Lessons", desc: "Access to 50+ recorded lectures." },
    { icon: "📚", title: "Study Material", desc: "PDF notes and worksheets included." },
    { icon: "🎓", title: "Certificate", desc: "Get certified upon completion." },
    { icon: "💬", title: "Live Support", desc: "Weekly doubt clearing sessions." },
  ];

  return (
    <div className="relative pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gray-900 z-0">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${course.gradient || 'from-yellow-500/20 to-transparent'} blur-[120px] opacity-40 rounded-full pointer-events-none`}></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
                {course.category} • {course.level}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {course.description}
            </p>

            {/* Meta Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-8">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <span>⏱</span> {course.duration} Duration
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <span>⭐</span> {course.rating} Rating
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <span>👥</span> {course.students}+ Enrolled
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center gap-6">
               <div>
                  <p className="text-gray-500 text-sm line-through">₹{course.price + 1000}</p>
                  <p className="text-3xl font-bold text-white">₹{course.price}<span className="text-sm font-normal text-gray-400"> / One-time</span></p>
               </div>
               <button className="bg-yellow-500 text-black font-bold text-lg px-8 py-3 rounded-full hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95">
                 Enroll Now
               </button>
            </div>
          </motion.div>

          {/* Hero Image / Video Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
             <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800 aspect-video group cursor-pointer">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${course.gradient || 'from-gray-700 to-gray-900'}`}></div>
                <div className="absolute bottom-4 left-4 right-4">
                   <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Watch Preview</p>
                   <p className="text-sm text-gray-300">Introduction to {course.title}</p>
                </div>
             </div>
          </motion.div>

        </div>
      </section>

      {/* --- MAIN CONTENT TABS --- */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        {/* Tab Headers */}
        <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4 mb-8">
           {['overview', 'syllabus', 'reviews'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`text-lg font-medium px-4 py-2 rounded-lg transition-all ${
                 activeTab === tab 
                 ? "bg-white/10 text-white" 
                 : "text-gray-500 hover:text-white hover:bg-white/5"
               } capitalize`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-2">
               <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                     <motion.div 
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                     >
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8">
                           <h3 className="text-xl font-bold text-white mb-4">What you'll learn</h3>
                           <div className="grid sm:grid-cols-2 gap-4">
                              {features.map((feature, i) => (
                                 <div key={i} className="flex gap-3">
                                    <span className="text-2xl">{feature.icon}</span>
                                    <div>
                                       <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                                       <p className="text-xs text-gray-400">{feature.desc}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-gray-400">
                           <h3 className="text-white">Description</h3>
                           <p>
                              This comprehensive course on <strong>{course.title}</strong> is designed to take you from a {course.level} level to an advanced understanding. 
                              Whether you are preparing for exams or improving your skills, this curriculum covers everything.
                           </p>
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'syllabus' && (
                     <motion.div 
                        key="syllabus"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                     >
                        {syllabus.map((module, idx) => (
                           <div key={idx} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                              <div className="bg-white/5 p-4 flex justify-between items-center cursor-pointer">
                                 <h4 className="font-bold text-white">Module {idx + 1}: {module.title}</h4>
                                 <span className="text-xs text-gray-400">{module.topics.length} Lessons</span>
                              </div>
                              <div className="p-4 space-y-2">
                                 {module.topics.map((topic, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg group">
                                       <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] group-hover:bg-yellow-500 group-hover:text-black transition-colors">▶</div>
                                       {topic}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                     <motion.div 
                        key="reviews"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-10 bg-white/5 rounded-2xl border border-white/5"
                     >
                        <p className="text-gray-400">Student reviews will appear here.</p>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Right Column (Sticky Info) */}
            <div className="lg:col-span-1">
               <div className="sticky top-24 bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4">Course Material</h3>
                  <div className="space-y-4 mb-6">
                     <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-red-500/20 text-red-500 rounded flex items-center justify-center">📄</div>
                           <div className="text-sm">
                              <p className="text-white font-bold">Syllabus.pdf</p>
                              <p className="text-gray-500 text-xs">2.4 MB</p>
                           </div>
                        </div>
                        <button className="text-gray-400 hover:text-white">⬇</button>
                     </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                     <p className="text-gray-400 text-sm mb-2">Total Fees</p>
                     <p className="text-3xl font-bold text-white mb-1">₹{course.price}</p>
                     <p className="text-xs text-green-400 mb-4">✓ One-time payment, Lifetime access</p>
                     
                     <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors mb-3">
                        Buy Now
                     </button>
                     <Link href="/contact" className="block text-center text-sm text-gray-400 hover:text-white">
                        Talk to an expert
                     </Link>
                  </div>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
}
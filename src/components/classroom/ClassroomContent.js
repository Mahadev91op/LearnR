"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, Users, Send, Book, File } from "lucide-react";

// Import the new NoticeBoard component
import NoticeBoard from "./NoticeBoard"; 
// Import the new SyllabusManager component (NEW ADDITION)
import SyllabusManager from "./SyllabusManager";

// 1. OVERVIEW TAB
const OverviewTab = ({ course }) => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
     {/* Stats Grid */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", val: course.students?.length || 0, color: "text-blue-400" },
          { label: "Content Hours", val: "12.5 Hrs", color: "text-green-400" },
          { label: "Assignments", val: "8 Pending", color: "text-orange-400" },
          { label: "Avg. Rating", val: "4.8/5.0", color: "text-yellow-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111] border border-white/10 p-5 rounded-2xl">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
             <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</h3>
          </div>
        ))}
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/10 p-6 rounded-3xl h-64 flex flex-col justify-center items-center text-gray-500">
           <p>Student Progress Chart (Coming Soon)</p>
        </div>
        <div className="bg-[#111] border border-white/10 p-6 rounded-3xl h-64 flex flex-col justify-center items-center text-gray-500">
           <p>Recent Activity Log (Coming Soon)</p>
        </div>
     </div>
  </div>
);

// 2. LIVE CLASS TAB (Wahi purana mast wala code)
const LiveTab = () => {
  const [isLive, setIsLive] = useState(false);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:flex-row bg-black overflow-hidden animate-in fade-in duration-300">
       {/* Stage Area */}
       <div className="flex-1 bg-[#111] relative flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 relative">
             <div className="relative w-full h-full max-h-[80vh] aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center group">
                 {cam ? (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-black animate-pulse">A</div>
                        <p className="text-gray-400 text-sm font-medium">{isLive ? "You are LIVE" : "Preview Mode"}</p>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center text-gray-600"><VideoOff size={40}/><p className="mt-2 text-xs">Camera Off</p></div>
                 )}
                 <div className="absolute top-4 left-4 bg-black/40 backdrop-blur p-2 rounded-lg text-white">
                    {mic ? <Mic size={16} className="text-green-400"/> : <MicOff size={16} className="text-red-400"/>}
                 </div>
             </div>
          </div>
          {/* Controls */}
          <div className="h-16 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-center gap-4">
              <button onClick={() => setMic(!mic)} className={`p-3 rounded-full ${mic ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>{mic ? <Mic size={20}/> : <MicOff size={20}/>}</button>
              <button onClick={() => setCam(!cam)} className={`p-3 rounded-full ${cam ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-500'}`}>{cam ? <VideoIcon size={20}/> : <VideoOff size={20}/>}</button>
              <button onClick={() => setIsLive(!isLive)} className={`px-6 py-2 rounded-full font-bold text-sm ${isLive ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'}`}>{isLive ? "END LIVE" : "GO LIVE"}</button>
          </div>
       </div>
       {/* Chat Area */}
       <div className="w-full md:w-80 bg-[#0f0f0f] border-l border-white/10 flex flex-col">
          <div className="p-3 border-b border-white/10 text-sm font-bold text-gray-400 uppercase">Live Chat</div>
          <div className="flex-1 p-4 flex items-center justify-center text-gray-600 text-sm">No messages yet</div>
          <div className="p-3 bg-[#0a0a0a] border-t border-white/10 flex gap-2">
             <input className="flex-1 bg-white/5 rounded-full px-4 text-sm text-white outline-none" placeholder="Type..." />
             <button className="p-2 bg-yellow-400 rounded-full text-black"><Send size={16}/></button>
          </div>
       </div>
    </div>
  );
};

// 3. GENERIC LIST TAB (For Materials, etc.)
const GenericListTab = ({ type, data }) => (
  <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
    <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-bold text-white capitalize">{type}</h2>
       <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors">
         + Add New {type.slice(0, -1)}
       </button>
    </div>
    
    <div className="space-y-3">
       {[1,2,3].map((item) => (
         <div key={item} className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-yellow-400/30 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/5 rounded-lg text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  {type === 'lectures' ? <VideoIcon size={20}/> : type === 'syllabus' ? <Book size={20}/> : <File size={20}/>}
               </div>
               <div>
                  <h4 className="font-bold text-white">Chapter {item}: Introduction to React</h4>
                  <p className="text-xs text-gray-500">Updated 2 days ago • Public</p>
               </div>
            </div>
            <div className="text-gray-500 text-sm font-medium">View Details →</div>
         </div>
       ))}
    </div>
  </div>
);

// MAIN EXPORT
export default function ClassroomContent({ activeTab, courseData }) {
  // Extract course ID safely
  const courseId = courseData?._id;

  // IMPORTANT: Since you are using this in the Admin Panel, we set isAdmin to true.
  // If you use this component for students later, you should pass this as a prop.
  const isAdmin = true;

  switch (activeTab) {
    case "overview": return <OverviewTab course={courseData} />;
    case "live": return <LiveTab />;
    
    // Updated Notice Board Integration
    case "notices": return <NoticeBoard courseId={courseId} isAdmin={isAdmin} />;

    // NEW SYLLABUS INTEGRATION
    case "syllabus": return <SyllabusManager courseId={courseId} />;

    case "lectures": return <GenericListTab type="lectures" data={[]} />;
    case "materials": return <GenericListTab type="materials" data={[]} />;
    case "assignments": return <GenericListTab type="assignments" data={[]} />;
    case "tests": return <GenericListTab type="tests" data={[]} />;
    default: return <div className="p-10 text-center text-gray-500">Tab Under Construction</div>;
  }
}
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Video, Radio, FileText, BookOpen, 
  ClipboardList, CheckSquare, Bell, ArrowLeft 
} from "lucide-react";

export default function StudentClassroomSidebar({ activeTab, setActiveTab, courseTitle }) {
  
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "lectures", label: "Lectures", icon: Video },
    { id: "live", label: "Live Class", icon: Radio },
    { id: "materials", label: "Materials", icon: FileText },
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "tests", label: "Tests", icon: CheckSquare },
    { id: "notices", label: "Notice Board", icon: Bell },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 bg-[#0a0a0a] border-r border-white/10 flex-col fixed left-0 top-0 z-[110]">
        <div className="p-6 border-b border-white/5">
           <Link href="/dashboard/classroom" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors mb-6 group w-fit">
              <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Back</span>
           </Link>
           <div>
               <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">{courseTitle}</h2>
               <span className="text-[10px] text-yellow-400 font-bold tracking-wide bg-yellow-400/10 px-2 py-0.5 rounded mt-2 inline-block border border-yellow-400/20">STUDENT</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="block w-full relative group outline-none">
                {isActive && (
                  <motion.div
                    layoutId="activeTabStudentClass"
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-xl border-l-4 border-yellow-400"
                  />
                )}
                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? "text-yellow-400 font-bold" : "text-gray-400 group-hover:text-white group-hover:bg-white/5"}`}>
                  <tab.icon size={20} className={isActive ? "text-yellow-400" : "text-gray-500 group-hover:text-white"} />
                  <span className="text-sm tracking-wide text-left">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between z-[110]">
            <Link href="/dashboard/classroom" className="text-gray-400 hover:text-white p-1"><ArrowLeft size={20}/></Link>
            <span className="font-bold text-white text-sm truncate max-w-[200px]">{courseTitle}</span>
            <div className="w-6"></div>
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 z-[110] pb-safe">
        <div className="flex items-center overflow-x-auto px-3 py-3 gap-3 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${isActive ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_-3px_rgba(250,204,21,0.4)]" : "bg-white/5 text-gray-400 border-white/10"}`}>
                  <tab.icon size={14} /> {tab.label}
               </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
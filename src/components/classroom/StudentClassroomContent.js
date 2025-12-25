"use client";
import { PlayCircle, FileText, Video } from "lucide-react";

// Existing Imports
import StudentNoticeBoard from "./StudentNoticeBoard"; 
import StudentSyllabusViewer from "./StudentSyllabusViewer"; 
import StudentLectureViewer from "./StudentLectureViewer";
import StudentMaterialsViewer from "./StudentMaterialsViewer";

// 1. OVERVIEW TAB (Original Design Preserved)
const OverviewTab = ({ course }) => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/10 p-5 rounded-2xl">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Progress</p>
             <h3 className="text-3xl font-black mt-2 text-yellow-400">12%</h3>
             <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-yellow-400 h-full w-[12%]"></div></div>
        </div>
        <div className="bg-[#111] border border-white/10 p-5 rounded-2xl">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Next Class</p>
             <h3 className="text-xl font-bold mt-2 text-white">Tomorrow, 10 AM</h3>
        </div>
        <div className="bg-[#111] border border-white/10 p-5 rounded-2xl">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Assignments</p>
             <h3 className="text-xl font-bold mt-2 text-orange-400">2 Pending</h3>
        </div>
     </div>
  </div>
);

// 2. LIVE TAB (Original Design Preserved)
const LiveTab = () => (
  <div className="flex flex-col h-[calc(100vh-80px)] md:flex-row bg-black overflow-hidden animate-in fade-in duration-300">
     <div className="flex-1 bg-[#111] relative flex items-center justify-center">
         <div className="text-center p-8">
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Video size={40} className="text-gray-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Waiting for Host...</h3>
             <p className="text-gray-500 text-sm">The live class hasn't started yet. Please wait.</p>
         </div>
     </div>
     <div className="w-full md:w-80 bg-[#0f0f0f] border-l border-white/10 flex flex-col p-4">
         <div className="text-sm font-bold text-gray-500 uppercase mb-4">Live Chat</div>
         <div className="flex-1 flex items-center justify-center text-gray-600 text-xs">Chat disabled until class starts</div>
     </div>
  </div>
);

// 3. GENERIC LIST TAB (Original Design Preserved)
const GenericListTab = ({ type }) => (
  <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-2xl font-bold text-white capitalize mb-6">{type}</h2>
    <div className="space-y-3">
       {[1,2,3,4].map((item) => (
         <div key={item} className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-yellow-400/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/5 rounded-lg text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  {type === 'lectures' ? <PlayCircle size={20}/> : <FileText size={20}/>}
               </div>
               <div>
                  <h4 className="font-bold text-white">Lesson {item}: Topic Name</h4>
                  <p className="text-xs text-gray-500">Duration: 45 mins</p>
               </div>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded text-xs font-bold text-gray-400 group-hover:text-white">Start</div>
         </div>
       ))}
    </div>
  </div>
);

export default function StudentClassroomContent({ activeTab, courseData }) {
  const courseId = courseData?._id;

  switch (activeTab) {
    case "overview": return <OverviewTab course={courseData} />;
    case "live": return <LiveTab />;
    case "notices": return <StudentNoticeBoard courseId={courseId} />;
    case "syllabus": return <StudentSyllabusViewer courseId={courseId} />;
    case "lectures": return <StudentLectureViewer courseId={courseId} />;
    case "materials": return <StudentMaterialsViewer courseId={courseId} />;

    // --- NEW TABS ---
    case "fees": return <div className="p-10 text-center text-gray-500">My Fees (Coming Soon)</div>;
    case "attendance": return <div className="p-10 text-center text-gray-500">My Attendance (Coming Soon)</div>;
    // ----------------

    case "assignments": return <GenericListTab type="assignments" />;
    case "tests": return <GenericListTab type="tests" />;
    default: return <div className="p-10 text-center text-gray-500">Coming Soon</div>;
  }
}
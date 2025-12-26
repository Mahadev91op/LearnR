"use client";
import { Book, File } from "lucide-react";

// Existing Imports
import NoticeBoard from "./NoticeBoard"; 
import SyllabusManager from "./SyllabusManager";
import LectureManager from "./LectureManager";
import MaterialsManager from "./MaterialsManager";

// New Import (Created in previous step)
import LiveClassManager from "./LiveClassManager";

// 1. OVERVIEW TAB (Original Design Preserved)
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

// 2. GENERIC LIST TAB (Original Design Preserved)
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
                  {type === 'syllabus' ? <Book size={20}/> : <File size={20}/>}
               </div>
               <div>
                  <h4 className="font-bold text-white">Item {item}: Description Here</h4>
                  <p className="text-xs text-gray-500">Updated recently • Public</p>
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
  const courseId = courseData?._id;
  const isAdmin = true;

  switch (activeTab) {
    case "overview": return <OverviewTab course={courseData} />;
    
    // UPDATED: Using the new separate component
    case "live": return <LiveClassManager courseId={courseId} />;
    
    case "notices": return <NoticeBoard courseId={courseId} isAdmin={isAdmin} />;
    case "syllabus": return <SyllabusManager courseId={courseId} />;
    case "lectures": return <LectureManager courseId={courseId} />;
    case "materials": return <MaterialsManager courseId={courseId} />;

    // --- NEW TABS ---
    case "fees": return <div className="p-10 text-center text-gray-500">Fee Management Module (Coming Soon)</div>;
    case "attendance": return <div className="p-10 text-center text-gray-500">Attendance Module (Coming Soon)</div>;
    // ----------------

    case "assignments": return <GenericListTab type="assignments" data={[]} />;
    case "tests": return <GenericListTab type="tests" data={[]} />;
    default: return <div className="p-10 text-center text-gray-500">Tab Under Construction</div>;
  }
}
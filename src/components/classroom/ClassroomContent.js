"use client";
import { useState } from "react";
import { Book, File, CheckSquare, ChevronRight, FileEdit } from "lucide-react";

// Existing Imports
import NoticeBoard from "./NoticeBoard"; 
import SyllabusManager from "./SyllabusManager";
import LectureManager from "./LectureManager";
import MaterialsManager from "./MaterialsManager";
import LiveClassManager from "./LiveClassManager";

// New Imports (Make sure these files exist in the same folder)
import MCQManager from "./MCQManager"; 
import SubjectiveManager from "./SubjectiveManager"; 

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

// 2. TESTS SELECTION TAB (Compact on Mobile, Large on PC)
const TestsSelection = ({ onSelect }) => {
  return (
    <div className="p-4 md:p-20 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-3">Select Exam Type</h2>
        <p className="text-gray-400 text-sm md:text-base">Choose the format of the assessment you want to create or manage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        {/* CARD 1: MCQ / OBJECTIVE */}
        <div 
          onClick={() => onSelect('mcq')} 
          className="group relative overflow-hidden bg-[#0a0a0a] border border-cyan-500/20 rounded-3xl md:rounded-[2rem] p-6 md:p-10 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)] hover:-translate-y-1"
        >
          {/* Background Glow Effect */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 md:-mr-32 md:-mt-32 group-hover:bg-cyan-500/20 transition-all duration-500"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 md:mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              MCQ & Quiz
            </h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 flex-grow">
              Create automated objective tests. Perfect for quick evaluations, practice quizzes, and entrance exam patterns.
            </p>

            <div className="flex items-center text-cyan-500 font-bold text-xs md:text-sm tracking-wide">
              MANAGE MCQs <ChevronRight size={16} className="ml-1 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 2: LONG QUESTION / SUBJECTIVE */}
        <div 
          onClick={() => onSelect('subjective')} 
          className="group relative overflow-hidden bg-[#0a0a0a] border border-fuchsia-500/20 rounded-3xl md:rounded-[2rem] p-6 md:p-10 cursor-pointer transition-all duration-300 hover:border-fuchsia-400 hover:shadow-[0_0_40px_-10px_rgba(232,121,249,0.3)] hover:-translate-y-1"
        >
          {/* Background Glow Effect */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-fuchsia-500/10 rounded-full blur-3xl -mr-20 -mt-20 md:-mr-32 md:-mt-32 group-hover:bg-fuchsia-500/20 transition-all duration-500"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-4 md:mb-6 border border-fuchsia-500/20 group-hover:scale-110 transition-transform duration-300">
              <FileEdit className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-400" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">
              Theory & Long Answer
            </h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 flex-grow">
              Set up subjective exams requiring detailed written answers. Includes manual grading and feedback tools.
            </p>

            <div className="flex items-center text-fuchsia-500 font-bold text-xs md:text-sm tracking-wide">
              MANAGE THEORY <ChevronRight size={16} className="ml-1 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// 3. GENERIC LIST TAB (Original Design Preserved)
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

  // State to manage Tests View locally (prevents Sidebar reload)
  const [testView, setTestView] = useState('selection'); // 'selection' | 'mcq' | 'subjective'

  // Reset test view if user clicks a different main tab
  if (activeTab !== 'tests' && testView !== 'selection') {
     setTestView('selection');
  }

  // Handle Tests Tab Logic
  if (activeTab === 'tests') {
      if (testView === 'mcq') {
          return (
             <div className="p-4 md:p-8 max-w-7xl mx-auto">
                 <MCQManager courseId={courseId} onBack={() => setTestView('selection')} />
             </div>
          );
      }
      if (testView === 'subjective') {
          return (
             <div className="p-4 md:p-8 max-w-7xl mx-auto">
                 <SubjectiveManager courseId={courseId} onBack={() => setTestView('selection')} />
             </div>
          );
      }
      return <TestsSelection onSelect={setTestView} />;
  }

  switch (activeTab) {
    case "overview": return <OverviewTab course={courseData} />;
    
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
    default: return <div className="p-10 text-center text-gray-500">Tab Under Construction</div>;
  }
}
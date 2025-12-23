"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, DollarSign, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Stats & Enrollments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Changed axios.get to fetch
      const res = await fetch("/api/admin/enrollments");
      const data = await res.json();
      
      // Ensure enrollments is an array
      setEnrollments(data.enrollments || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      // Changed axios.post to fetch
      const res = await fetch("/api/admin/enrollments/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: id, action }),
      });

      if (res.ok) {
        // Remove from list locally if success
        setEnrollments((prev) => prev.filter((e) => e._id !== id));
        alert(`Enrollment ${action}ed successfully!`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const stats = [
    { title: "Total Students", value: "1,240", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Active Courses", value: "12", icon: BookOpen, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { title: "Revenue", value: "₹4.2L", icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Pending Req", value: enrollments.length, icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Manage your empire from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- PENDING ENROLLMENTS SECTION --- */}
      <div className="space-y-4">
         <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
            Pending Enrollments
         </h2>

         {loading ? (
             <p className="text-gray-500">Loading requests...</p>
         ) : enrollments.length === 0 ? (
             <div className="p-8 border border-white/10 rounded-2xl bg-[#111] text-center text-gray-500">
                No pending requests at the moment.
             </div>
         ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {enrollments.map((req) => (
                   <motion.div 
                      key={req._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="bg-[#111] border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-yellow-500/30 transition-all group"
                   >
                      {/* User & Course Info */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {req.user?.name?.[0] || "U"}
                         </div>
                         <div>
                            <h4 className="font-bold text-white text-lg">{req.user?.name}</h4>
                            <p className="text-gray-400 text-sm">{req.user?.email}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                               <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">Course: {req.course?.title}</span>
                               <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">Paid: ₹{req.amount}</span>
                            </div>
                         </div>
                      </div>

                      {/* Transaction Info */}
                      <div className="text-left md:text-right w-full md:w-auto">
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Transaction ID</p>
                          <p className="font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 text-sm">
                             {req.transactionId}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                         <button 
                            onClick={() => handleAction(req._id, "reject")}
                            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-medium text-sm"
                         >
                            <XCircle size={16} /> Reject
                         </button>
                         <button 
                            onClick={() => handleAction(req._id, "approve")}
                            className="flex-1 md:flex-none px-6 py-2 rounded-xl bg-green-500 text-black font-bold hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 text-sm transform active:scale-95"
                         >
                            <CheckCircle size={16} /> Approve
                         </button>
                      </div>
                   </motion.div>
                ))}
              </AnimatePresence>
            </div>
         )}
      </div>
    </div>
  );
}
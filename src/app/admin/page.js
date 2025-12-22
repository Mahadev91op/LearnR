"use client";
import { motion } from "framer-motion";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  // Dummy Data (API se connect kar sakte ho bad me)
  const stats = [
    { title: "Total Students", value: "1,240", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Active Courses", value: "12", icon: BookOpen, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { title: "Total Revenue", value: "₹4.2L", icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Growth", value: "+18%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back, Admin! Here's what's happening today.</p>
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

      {/* Recent Activity Section (Example) */}
      <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
         <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
         <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                   <Users size={16}/>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">New student registered <span className="text-yellow-400">@rahul_kumar</span></p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
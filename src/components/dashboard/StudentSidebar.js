"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/shared/AuthContext";

export default function StudentSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar (No Changes - Same as before) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0a0a0a] border-r border-white/10 z-40">
        {/* Logo Area */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-black text-white text-2xl tracking-tighter">
              Learn<span className="text-yellow-400">R</span>
            </span>
            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded ml-2 uppercase tracking-wide">
              Student
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-yellow-400 text-black font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-black" : "group-hover:text-yellow-400 transition-colors"} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-black"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <Home size={20} className="group-hover:text-blue-400 transition-colors" />
            <span>Back to Home</span>
          </Link>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav (App-like Compact Design) */}
      {/* UPDATE: Padding reduced (py-2), darker background, and shadow for 'App' feel */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505] border-t border-white/10 z-50 px-8 py-3 pb-5 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {menuItems.map((item) => {
             const isActive = pathname === item.path;
             return (
              <Link key={item.path} href={item.path} className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive ? "text-yellow-400" : "text-gray-600 hover:text-gray-400"}`}>
                  <div className={`p-1 rounded-full ${isActive ? "bg-yellow-400/10" : ""}`}>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
              </Link>
             )
        })}
         {/* Mobile Home Button */}
         <Link href="/" className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 active:scale-90 transition-all">
            <div className="p-1">
              <Home size={22} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium tracking-wide">Home</span>
         </Link>
      </div>
    </>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/components/shared/AuthContext"; // Import useAuth

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const { login } = useAuth(); // Auth context se login function nikalein
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        addToast("Login Successful! Redirecting...", "success");
        
        // Yahan MAGIC hai: Context update karein taaki Navbar turant change ho
        login(data.user); // Maan lijiye API user data bhi bhej raha hai

        // Agar API user data nahi bhej raha, to hum manually fetch kar sakte hain:
        // (Lekin behtar ye hai ki aap login API se user data return karein)
        
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        addToast(data.error || "Login failed.", "error");
      }
    } catch (error) {
      setLoading(false);
      addToast("Something went wrong!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Login to continue your learning.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 transition-all placeholder-gray-500"
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 transition-all placeholder-gray-500"
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full font-bold py-3 rounded-xl transition-all ${
              loading 
              ? "bg-gray-600 cursor-not-allowed text-gray-300" 
              : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)] hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          New here? <Link href="/signup" className="text-yellow-400 hover:underline">Create an Account</Link>
        </p>

      </motion.div>
    </div>
  );
}
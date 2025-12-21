"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", fatherName: "", phone: "", email: "", otp: "", school: "", classLevel: "", password: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Send OTP
  const sendOtp = async () => {
    if (!form.email) return alert("Please enter email first");
    setLoading(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setOtpSent(true);
      alert("OTP sent to your email!");
    } else {
      alert(data.error);
    }
  };

  // Register User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      alert("Registration Successful!");
      router.push("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join LearnR and start your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" onChange={handleChange} placeholder="Full Name" required className="input-field" />
            <input name="fatherName" onChange={handleChange} placeholder="Father's Name" required className="input-field" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input name="phone" onChange={handleChange} placeholder="Phone Number" required className="input-field" />
             <input name="school" onChange={handleChange} placeholder="School Name" required className="input-field" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Class Dropdown */}
             <select name="classLevel" onChange={handleChange} required className="input-field text-gray-400">
               <option value="">Select Class</option>
               {[5,6,7,8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
             </select>
             <input type="password" name="password" onChange={handleChange} placeholder="Password" required className="input-field" />
          </div>

          {/* Email & OTP Section */}
          <div className="flex gap-2">
            <input name="email" type="email" onChange={handleChange} placeholder="Email Address" required className="input-field flex-grow" disabled={otpSent} />
            <button type="button" onClick={sendOtp} disabled={otpSent || loading} className="bg-white/10 text-yellow-400 px-4 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/20 whitespace-nowrap">
              {loading ? "..." : otpSent ? "Sent ✓" : "Get OTP"}
            </button>
          </div>

          {otpSent && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
               <input name="otp" onChange={handleChange} placeholder="Enter 6-digit OTP" required className="input-field border-yellow-500/50" />
             </motion.div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)] transition-all mt-4">
            {loading ? "Registering..." : "Sign Up"}
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link href="/login" className="text-yellow-400 hover:underline">Login here</Link>
        </p>

      </motion.div>
      
      {/* Global CSS for Inputs (Add inside component strictly for scoped feel or use global) */}
      <style jsx>{`
        .input-field {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .input-field:focus {
          border-color: rgba(234,179,8,0.5);
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/shared/AuthContext"; //
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    school: "",
    classLevel: "",
  });

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  // Data Loading
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setFormData({
        name: user.name || "",
        fatherName: user.fatherName || "",
        email: user.email || "",
        phone: user.phone || "",
        school: user.school || "",
        classLevel: user.classLevel || "",
      });
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: OTP Request Send Karna
  const initiateUpdate = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/user/send-otp", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setShowOtpModal(true); // Modal Open karo
        setStatus({ type: "success", message: "OTP sent to your email!" });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to send OTP" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Server connection failed" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // STEP 2: OTP Verify karke Data Update karna
  const verifyAndUpdate = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            otp: otp // OTP bhejna zaroori hai
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Profile updated successfully! ✅" });
        login(data.user); // Context update
        setShowOtpModal(false); // Close Modal
        setOtp(""); // Clear OTP
        setTimeout(() => setStatus({ type: "", message: "" }), 3000);
      } else {
        setStatus({ type: "error", message: data.message || "Invalid OTP" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Update failed" });
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-12 px-4 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Profile</span>
            </h1>
            <p className="text-gray-400 mt-2">Manage your personal information and academic details.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-yellow-400/20 to-purple-600/20" />
              <div className="relative mt-12 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-1 shadow-xl mb-4">
                  <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden">
                    {formData.name?.charAt(0).toUpperCase()}
                    <div className="absolute inset-0 bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{formData.name}</h2>
                <p className="text-sm text-yellow-400 font-medium bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  Student Account
                </p>
                <div className="w-full h-px bg-white/10 my-6" />
                <div className="w-full space-y-4">
                  <InfoItem icon={MailIcon} label="Email" value={formData.email} />
                  <InfoItem icon={PhoneIcon} label="Phone" value={formData.phone} />
                  <InfoItem icon={SchoolIcon} label="School" value={formData.school} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Edit Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 lg:col-span-2"
          >
            {/* Note: onSubmit changed to initiateUpdate */}
            <form onSubmit={initiateUpdate} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-400 rounded-full"></span>
                Edit Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={UserIcon} />
                <InputGroup label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} icon={UserIcon} />
                <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={PhoneIcon} />
                
                <div className="space-y-2 opacity-60">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-500"><MailIcon className="w-5 h-5" /></div>
                    <input type="text" value={formData.email} disabled className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed" />
                    <div className="absolute right-4 top-3.5 text-xs text-gray-500 font-mono">LOCKED</div>
                  </div>
                </div>

                <InputGroup label="School / College" name="school" value={formData.school} onChange={handleChange} icon={SchoolIcon} />
                <InputGroup label="Class / Standard" name="classLevel" value={formData.classLevel} onChange={handleChange} icon={BookIcon} />
              </div>

              <div className="mt-8 flex items-center justify-end gap-4 border-t border-white/10 pt-6">
                <button type="button" className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSendingOtp}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSendingOtp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending OTP...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>

      {/* --- OTP MODAL (New) --- */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 left-0"></div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400 border border-yellow-500/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Security Verification</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  We've sent a 6-digit code to <br/> <span className="text-white font-mono">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={verifyAndUpdate} className="space-y-6">
                <div>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-3xl font-bold text-white tracking-[1em] focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all placeholder:text-gray-700 placeholder:tracking-normal placeholder:text-sm"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying || otp.length < 6}
                    className="flex-1 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </>
                    ) : (
                      "Verify & Update"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md flex items-center gap-3 z-[60] ${
              status.type === "success" 
                ? "bg-green-500/10 border-green-500/50 text-green-400" 
                : "bg-red-500/10 border-red-500/50 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            <span className="font-medium">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Icons & Inputs (Same as before) ---
function InputGroup({ label, name, value, onChange, icon: Icon }) {
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-medium text-gray-400 ml-1 group-focus-within:text-yellow-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-400 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all hover:border-white/20"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left overflow-hidden">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-sm text-gray-200 truncate font-medium">{value || "Not set"}</p>
      </div>
    </div>
  );
}

const UserIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const SchoolIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const BookIcon = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Page Load par check karein ki user login hai ya nahi
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Cache avoid karne ke liye timestamp add kiya
        const res = await fetch(`/api/auth/me?t=${Date.now()}`);
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Check Failed:", error);
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // Login function (Login page se call hoga)
  const login = (userData) => {
    setUser(userData); // Turant state update
    router.refresh(); // Server components refresh
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null); // Turant state clear
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
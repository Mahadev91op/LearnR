import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ToastProvider } from "@/components/shared/Toast";
import { AuthProvider } from "@/components/shared/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LearnR - The Future of English Learning",
  description: "Join the revolution of smart education with LearnR.",
};

export default function RootLayout({ children }) {
  return (
    // FIX: suppressHydrationWarning yahan add kiya gaya hai
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            {children}
            
            {/* Vercel Analytics */}
            <Analytics />
            
            {/* SpeedInsights */}
            <SpeedInsights />
            
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
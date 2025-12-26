import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ToastProvider } from "@/components/shared/Toast";
import { AuthProvider } from "@/components/shared/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// FIX: 'display: swap' add kiya gaya hai taaki text turant visible ho
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', 
  variable: '--font-inter', // CSS Variable (Optional, better performance)
});

export const metadata = {
  title: "LearnR - The Future of English Learning",
  description: "Join the revolution of smart education with LearnR.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            
            {/* Main content wrapper optimization */}
            <main className="min-h-screen">
              {children}
            </main>
            
            <Analytics />
            <SpeedInsights />
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
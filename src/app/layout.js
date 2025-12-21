import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LearnR - The Future of English Learning",
  description: "Join the revolution of smart education with LearnR.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* FIX: suppressHydrationWarning={true} add kiya gaya hai.
        Yeh browser extensions (Grammarly, etc.) ki wajah se aane wale
        attributes mismatch error ko ignore karega.
      */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        {children}
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
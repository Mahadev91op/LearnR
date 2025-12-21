import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer"; // <-- Footer Import kiya

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LearnR - The Future of English Learning",
  description: "Join the revolution of smart education with LearnR.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
import HeroSection from "../components/homepage/HeroSection";
import Features from "../components/homepage/Features"; // Naya Import

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSection />
      <Features />
      
      {/* Next: Pricing / Syllabus / Footer */}
    </main>
  );
}
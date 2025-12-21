import HeroSection from "../components/homepage/HeroSection";
import Features from "../components/homepage/Features";
import AboutSection from "../components/homepage/AboutSection"; // <-- Import kiya
import StudentReviews from "../components/homepage/StudentReviews";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSection />
      
      {/* Features ke baad About Section add kiya */}
      <Features />
      <AboutSection /> 
      
      <StudentReviews />
    </main>
  );
}
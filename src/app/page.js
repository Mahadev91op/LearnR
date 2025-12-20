import HeroSection from "../components/homepage/HeroSection";
import Features from "../components/homepage/Features";
import StudentReviews from "../components/homepage/StudentReviews"; // Naya Import

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSection />
      <Features />
      <StudentReviews />
    </main>
  );
}
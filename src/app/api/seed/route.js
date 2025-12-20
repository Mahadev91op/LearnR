import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feature from "@/models/Feature";
import Review from "@/models/Review"; // Naya Import

export async function GET() {
  try {
    await connectDB();

    // 1. Clear Old Data
    await Feature.deleteMany({});
    await Review.deleteMany({}); // Reviews bhi clear karein

    // 2. Insert Features (Purana code same rahega)
    const features = [
      {
        title: "Live Interactive Classes",
        description: "Join real-time sessions with expert mentors. Raise your hand and clear doubts instantly.",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.818v6.364a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`
      },
      {
        title: "Smart Study Material",
        description: "Access premium recorded lectures, PDF notes, and curated YouTube links all in one place.",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`
      },
      {
        title: "Weekly Tests & Ranking",
        description: "Compete in live tests. Get instant rank display and detailed performance analysis.",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`
      },
      {
        title: "Homework & Feedback",
        description: "Upload your assignments easily and get personalized feedback from teachers.",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`
      },
      {
        title: "Digital Notice Board",
        description: "Stay updated with important announcements, class schedules, and exam dates.",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>`
      },
      {
        title: "Fee & Attendance",
        description: "Track your attendance records and manage fee payments with automated invoices.",
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
      },
    ];

    await Feature.insertMany(features);

    // 3. Insert Reviews (Naya Data)
    const reviews = [
      {
        name: "Rahul Sharma",
        role: "Class 12 Student",
        message: "LearnR has completely changed how I study English. The live classes are interactive, and my grammar has improved significantly!",
        rating: 5
      },
      {
        name: "Priya Patel",
        role: "Competitive Exam Aspirant",
        message: "The weekly tests are amazing. I can see my rank instantly and work on my weak areas. Highly recommended!",
        rating: 5
      },
      {
        name: "Amit Verma",
        role: "Class 10 Student",
        message: "I love the digital notice board feature. I never miss any class updates or homework deadlines now.",
        rating: 4
      },
      {
        name: "Sneha Gupta",
        role: "College Student",
        message: "The study material is top-notch. I don't need to buy extra books because everything is available in the app.",
        rating: 5
      }
    ];

    await Review.insertMany(reviews);

    return NextResponse.json({ message: "Database seeded successfully with Features and Reviews!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();

    // Pehle purana data saaf karenge (optional)
    await Course.deleteMany({});

    const courses = [
      {
        title: "Complete English Grammar",
        description: "Master parts of speech, tenses, and sentence structures. Perfect for Class 5-8 students building a strong foundation.",
        price: 999,
        duration: "3 Months",
        level: "Beginner",
        rating: 4.8,
        students: 1250,
        category: "Grammar",
        gradient: "from-blue-400 to-blue-600"
      },
      {
        title: "Spoken English Confidence",
        description: "Remove fear of speaking in public. Interactive sessions to help students talk fluently without hesitation.",
        price: 1499,
        duration: "2 Months",
        level: "Intermediate",
        rating: 4.9,
        students: 850,
        category: "Speaking",
        gradient: "from-purple-400 to-purple-600"
      },
      {
        title: "Board Exam Prep (Class 10)",
        description: "Target 95%+ in English Core. Covers reading comprehension, writing skills, and literature analysis.",
        price: 1999,
        duration: "4 Months",
        level: "Advanced",
        rating: 4.7,
        students: 3200,
        category: "Exam Prep",
        gradient: "from-yellow-400 to-orange-500"
      },
      {
        title: "Creative Writing Workshop",
        description: "Learn to write amazing stories, essays, and poems. Unlock your imagination and vocabulary.",
        price: 799,
        duration: "6 Weeks",
        level: "All Levels",
        rating: 4.6,
        students: 500,
        category: "Writing",
        gradient: "from-green-400 to-emerald-600"
      },
      {
        title: "English Olympiad Mastery",
        description: "Advanced vocabulary and logic training for students appearing in IEO and other competitive exams.",
        price: 1299,
        duration: "3 Months",
        level: "Advanced",
        rating: 4.9,
        students: 600,
        category: "Competitive",
        gradient: "from-pink-400 to-rose-600"
      },
      {
        title: "Vocabulary Builder Pro",
        description: "Learn 5 new words every day. Fun quizzes and memory techniques to boost your word power.",
        price: 499,
        duration: "1 Month",
        level: "Beginner",
        rating: 4.5,
        students: 2100,
        category: "Vocabulary",
        gradient: "from-cyan-400 to-blue-500"
      },
      {
        title: "Public Speaking for Kids",
        description: "Become a young leader. Learn body language, voice modulation, and stage presence.",
        price: 1599,
        duration: "2 Months",
        level: "Intermediate",
        rating: 4.8,
        students: 450,
        category: "Speaking",
        gradient: "from-indigo-400 to-violet-600"
      },
      {
        title: "Reading Comprehension",
        description: "Read faster and understand better. Essential skills for exams and lifelong learning.",
        price: 699,
        duration: "1 Month",
        level: "Beginner",
        rating: 4.4,
        students: 900,
        category: "Reading",
        gradient: "from-teal-400 to-teal-600"
      }
    ];

    await Course.create(courses);

    return NextResponse.json({ message: "8 School Courses Added Successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
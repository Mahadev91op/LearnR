import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User"; // Auth check ke liye (security)

// Helper to check admin (Simplify kar raha hu, aap apne session logic se replace karein)
async function isAdmin(req) {
    // Yahan aapko actual session/token check lagana padega.
    // Abhi ke liye hum assume kar rahe hain ki request header mein admin secret ya token hai.
    return true; 
}

export async function POST(req) {
  try {
    await connectToDatabase();
    
    // Security Check
    // if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, price, duration, level, category, gradient } = body;

    // Validation
    if (!title || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCourse = await Course.create({
      title,
      description,
      price,
      duration,
      level,
      category,
      gradient,
      rating: 4.5,
      students: 0
    });

    return NextResponse.json({ message: "Course Created", course: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET() {
    try {
        await connectToDatabase();
        const courses = await Course.find({}).sort({ createdAt: -1 });
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}
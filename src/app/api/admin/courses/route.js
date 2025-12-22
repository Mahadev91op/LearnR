import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // CHANGE: connectToDatabase -> connectDB
import Course from "@/models/Course";
import User from "@/models/User";

// Helper to check admin
async function isAdmin(req) {
    return true; 
}

export async function POST(req) {
  try {
    await connectDB(); // CHANGE: connectToDatabase() -> connectDB()
    
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
    console.error("Course Create Error:", error); // Debugging ke liye log add kiya
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET() {
    try {
        await connectDB(); // CHANGE: connectToDatabase() -> connectDB()
        const courses = await Course.find({}).sort({ createdAt: -1 });
        return NextResponse.json(courses);
    } catch (error) {
        console.error("Course Fetch Error:", error); // Debugging ke liye log add kiya
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}
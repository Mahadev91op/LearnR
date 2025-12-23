import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course"; // Model register karna zaroori hai

export async function GET() {
  try {
    await connectDB();
    
    // FIX: Next.js 16+ mein cookies() async hai, isliye await lagana zaroori hai
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token Verify
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    
    // Enrollments Fetching
    // 'populate' se Course ka data (title, image etc.) aayega
    const enrollments = await Enrollment.find({ 
      user: decoded.id, 
      status: "approved" 
    })
    .populate("course")
    .lean();

    // Console log for debugging (Server terminal check karein)
    console.log("User ID:", decoded.id);
    console.log("Found Enrollments:", enrollments.length);

    return NextResponse.json({ enrollments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}
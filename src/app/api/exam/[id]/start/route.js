import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import { getDataFromToken } from "@/lib/getDataFromToken";
import Enrollment from "@/models/Enrollment";
import Result from "@/models/Result";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // 1. Authenticate User
    const userId = await getDataFromToken(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Fetch Test
    const test = await Test.findById(id).select("-questions.correctOption"); // Don't send correct answers!
    if (!test) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    // 3. Check Status
    if (test.status !== 'live') {
        return NextResponse.json({ error: "Exam is not live currently." }, { status: 403 });
    }

    // 4. Check Enrollment
    const enrollment = await Enrollment.findOne({ courseId: test.courseId, studentId: userId });
    if (!enrollment) {
        return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 });
    }

    // 5. Check if already attempted
    const existingResult = await Result.findOne({ testId: id, studentId: userId });
    if (existingResult) {
        return NextResponse.json({ error: "You have already submitted this exam." }, { status: 400 });
    }

    return NextResponse.json({ 
        success: true, 
        test: test 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to start exam" }, { status: 500 });
  }
}
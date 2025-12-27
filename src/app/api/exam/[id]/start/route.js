import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";
import { getDataFromToken } from "@/lib/getDataFromToken"; // Auth helper

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const user = await getDataFromToken(req); 
    const { id } = params;

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ success: false, message: "Test not found" });

    // 1. Time Check (12 Hours Window)
    const now = new Date();
    const startTime = new Date(test.scheduledAt);
    const endTime = new Date(startTime.getTime() + 12 * 60 * 60 * 1000); 

    if (now < startTime) {
      return NextResponse.json({ success: false, message: "Exam has not started yet." });
    }
    if (now > endTime) {
      return NextResponse.json({ success: false, message: "Exam window is closed." });
    }

    // 2. Check Duplicate Attempt
    const existingResult = await Result.findOne({ testId: id, studentId: user.id });
    if (existingResult) {
      return NextResponse.json({ success: false, message: "You have already attempted this test." });
    }

    // 3. SECURE RESPONSE: (Hide Correct Answer & Description)
    const secureQuestions = test.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
      // NOTE: correctOption aur description yahan NAHI bhej rahe hain security ke liye
    }));

    return NextResponse.json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        questions: secureQuestions
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
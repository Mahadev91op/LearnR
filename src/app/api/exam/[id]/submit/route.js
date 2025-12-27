import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { answers, timeTaken } = await req.json(); // answers is array of option indexes

    const userId = await getDataFromToken(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Fetch Original Test (With Correct Options)
    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

    // 2. Calculate Score
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    test.questions.forEach((q, index) => {
        const userAns = answers[index];
        const correctAns = q.correctOption;

        if (userAns !== undefined && userAns !== -1 && userAns !== null) {
            if (userAns === correctAns) {
                score += 1; // +1 for correct
                correctCount++;
            } else {
                score -= 0.25; // -0.25 for wrong
                wrongCount++;
            }
        }
    });

    // Ensure score isn't negative (optional, but good practice)
    if (score < 0) score = 0;

    // 3. Save Result
    const newResult = await Result.create({
        testId: id,
        studentId: userId,
        score,
        totalMarks: test.totalMarks,
        answers, // Save user responses for review
        correctCount,
        wrongCount,
        timeTaken: timeTaken || 0,
    });

    return NextResponse.json({ 
        success: true, 
        message: "Exam submitted successfully",
        resultId: newResult._id,
        score 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Submission Failed" }, { status: 500 });
  }
}
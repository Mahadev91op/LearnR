import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    // FIX: params ko await karna zaruri hai
    const { id } = await params;
    const testId = id;

    const test = await Test.findById(testId);
    if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

    // 1. Get All Results for this test
    // Note: Make sure your Result model uses 'testId' or 'examId'. I am using 'testId' here.
    const results = await Result.find({ testId }).populate("studentId", "fullName email");

    // 2. Get All Enrolled Students (to find who didn't take the test)
    const enrollments = await Enrollment.find({ courseId: test.courseId }).populate("studentId", "fullName email");

    // --- LOGIC: Process Data ---
    
    const studentsData = [];
    const attemptMap = new Map();

    // Process Present Students
    results.forEach(res => {
        if(res.studentId) {
            attemptMap.set(res.studentId._id.toString(), true);
            studentsData.push({
                id: res.studentId._id,
                name: res.studentId.fullName,
                email: res.studentId.email,
                score: res.score,
                totalMarks: res.totalMarks,
                status: 'Present',
                timeTaken: res.timeTaken || 0,
                submittedAt: res.createdAt,
                answers: res.answers || [] // Array of user choices
            });
        }
    });

    // Process Absent Students
    enrollments.forEach(enr => {
        if(enr.studentId && !attemptMap.has(enr.studentId._id.toString())) {
            studentsData.push({
                id: enr.studentId._id,
                name: enr.studentId.fullName,
                email: enr.studentId.email,
                score: 0,
                totalMarks: test.totalMarks,
                status: 'Absent',
                answers: []
            });
        }
    });

    // Sort by Score (Rank)
    studentsData.sort((a, b) => b.score - a.score);
    
    // Assign Ranks
    studentsData.forEach((s, index) => s.rank = index + 1);

    // Smartest Students (Top 5)
    const topStudents = studentsData.filter(s => s.status === 'Present').slice(0, 5);

    // Question Analysis
    const questionStats = test.questions.map((q, idx) => ({
        qIndex: idx + 1,
        questionText: q.questionText,
        wrongCount: 0,
        correctCount: 0,
        unattemptedCount: 0
    }));

    results.forEach(res => {
        if(res.answers && Array.isArray(res.answers)){
            res.answers.forEach((ans, qIdx) => {
                if (qIdx < questionStats.length) {
                    const correctOpt = test.questions[qIdx].correctOption;
                    if (ans === null || ans === undefined || ans === -1) {
                        questionStats[qIdx].unattemptedCount++;
                    } else if (ans !== correctOpt) {
                        questionStats[qIdx].wrongCount++;
                    } else {
                        questionStats[qIdx].correctCount++;
                    }
                }
            });
        }
    });

    // Sort questions by "Most Wrong"
    const hardQuestions = [...questionStats].sort((a, b) => b.wrongCount - a.wrongCount).slice(0, 5);

    return NextResponse.json({
        testTitle: test.title,
        totalMarks: test.totalMarks,
        questions: test.questions,
        analytics: {
            topStudents,
            hardQuestions,
            studentsData,
            stats: {
                totalStudents: enrollments.length,
                present: results.length,
                absent: enrollments.length - results.length
            }
        }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Analytics Failed" }, { status: 500 });
  }
}
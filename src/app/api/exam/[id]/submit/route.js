import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function POST(req, { params }) {
  await dbConnect();
  try {
    const user = await getDataFromToken(req);
    const { id } = params;
    // answers structure: [{ questionId, selectedOption }]
    const { answers, isAutoSubmit } = await req.json(); 

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ success: false, message: "Test not found" });

    // Check if already submitted (Double submission prevention)
    const existing = await Result.findOne({ testId: id, studentId: user.id });
    if(existing) {
         return NextResponse.json({ success: true, message: "Already submitted." });
    }

    // --- MARKS CALCULATION ---
    let obtainedMarks = 0;
    
    // Map for fast lookup (Question ID -> Correct Option & Marks)
    const correctAnswersMap = {};
    test.questions.forEach(q => {
      correctAnswersMap[q._id.toString()] = { correct: q.correctOption, marks: q.marks };
    });

    const formattedAnswers = [];

    if (answers && answers.length > 0) {
        answers.forEach(ans => {
          const questionData = correctAnswersMap[ans.questionId];
          if (questionData) {
            // Save what student selected
            formattedAnswers.push({
              questionId: ans.questionId,
              selectedOption: ans.selectedOption
            });
    
            // Check correctness
            if (ans.selectedOption === questionData.correct) {
              obtainedMarks += questionData.marks;
            }
          }
        });
    }

    // Save Result to DB
    await Result.create({
      testId: id,
      studentId: user.id,
      answers: formattedAnswers,
      obtainedMarks,
      totalMarks: test.totalMarks,
      status: isAutoSubmit ? 'auto-submitted' : 'completed'
    });

    return NextResponse.json({ success: true, message: "Test submitted successfully!" });

  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
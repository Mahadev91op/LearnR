import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const user = await getDataFromToken(req);
    const { id: testId } = params;

    // 1. Find Result
    const result = await Result.findOne({ testId, studentId: user.id });
    if (!result) {
      return NextResponse.json({ success: false, message: "Result not found" });
    }

    // 2. Find Test (To get questions and scheduled time)
    const test = await Test.findById(testId);
    
    // 3. Time Logic Check (12 Hours)
    const startTime = new Date(test.scheduledAt);
    // Exam Window End Time + Buffer if needed, usually just start + 12h
    const resultRevealTime = new Date(startTime.getTime() + 12 * 60 * 60 * 1000); 
    const now = new Date();
    
    // If current time is past the window, declare results
    const isResultDeclared = now >= resultRevealTime;

    // 4. Prepare Data
    const processedQuestions = test.questions.map(q => {
      // Find what the user answered
      const userAnswer = result.answers.find(a => a.questionId.toString() === q._id.toString());
      
      return {
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
        selectedOption: userAnswer ? userAnswer.selectedOption : null,
        
        // SECURITY: Hide correct answer/description if result is NOT yet declared
        correctOption: isResultDeclared ? q.correctOption : null,
        description: isResultDeclared ? q.description : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        obtainedMarks: result.obtainedMarks,
        totalMarks: result.totalMarks,
        isResultDeclared, 
        revealTime: resultRevealTime,
        questions: processedQuestions
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
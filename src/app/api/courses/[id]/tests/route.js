import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Test from "@/models/Test";
import Result from "@/models/Result";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Course ID

    // 1. User Authentication (Check kaun user hai)
    let userId = null;
    try {
        userId = await getDataFromToken(req);
    } catch (e) {
        console.log("User not logged in or invalid token");
    }

    // 2. Fetch Tests for this Course (Drafts nahi dikhana hai)
    const tests = await Test.find({ 
      courseId: id, 
      status: { $ne: 'draft' } 
    }).sort({ scheduledAt: -1 }); // Latest pehle

    // 3. Check Attempts (Agar user login hai to check karo usne kaunsa test diya hai)
    let attemptsMap = {};
    if (userId) {
        const results = await Result.find({ 
            studentId: userId, 
            testId: { $in: tests.map(t => t._id) } 
        });
        
        results.forEach(r => {
            attemptsMap[r.testId.toString()] = r;
        });
    }

    // 4. Combine Data
    const processedTests = tests.map(test => {
        const attempt = attemptsMap[test._id.toString()];
        return {
            ...test._doc,
            isAttempted: !!attempt, // true agar result mila
            resultId: attempt ? attempt._id : null,
            score: attempt ? attempt.score : null
        };
    });

    return NextResponse.json({ success: true, tests: processedTests });

  } catch (error) {
    console.error("Fetch Tests Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
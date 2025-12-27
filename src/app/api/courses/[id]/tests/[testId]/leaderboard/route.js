import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Result from "@/models/Result";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    // Await params if using Next.js 15+, otherwise standard destructuring works too
    const { id, testId } = await params; // 'courseId' को 'id' में बदल दिया

    // 1. कोर्स के सभी स्टूडेंट्स लाओ (यहाँ अब courseId की जगह id यूज़ करें)
    const enrollments = await Enrollment.find({ courseId: id }).populate("studentId", "name email avatar");
    
    // 2. इस टेस्ट के सभी रिजल्ट्स लाओ
    const results = await Result.find({ testId });

    // 3. डेटा मर्ज करो (Leaderboard बनाओ)
    let leaderboard = enrollments.map(enrollment => {
      const student = enrollment.studentId;
      if (!student) return null; // Skip invalid users

      // चेक करो कि स्टूडेंट ने एग्जाम दिया या नहीं
      const studentResult = results.find(r => r.studentId.toString() === student._id.toString());

      return {
        studentId: student._id,
        name: student.name,
        avatar: student.avatar,
        email: student.email,
        marks: studentResult ? studentResult.obtainedMarks : 0, // नहीं दिया तो 0
        status: studentResult ? "Attempted" : "Absent",
        isPass: studentResult ? (studentResult.obtainedMarks >= 33) : false, // 33% logic example
        timeTaken: studentResult ? studentResult.submittedAt : null 
      };
    }).filter(Boolean); // Null values hatao

    // 4. Sort (Ranking): ज्यादा मार्क्स वाले ऊपर
    leaderboard.sort((a, b) => b.marks - a.marks);

    return NextResponse.json({ success: true, leaderboard });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
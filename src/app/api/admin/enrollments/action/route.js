import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { userId, courseId } = body;

    // 1. Validation: Check if IDs are present
    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "User ID and Course ID are required" },
        { status: 400 }
      );
    }

    // 2. Check for Duplicate Enrollment (To prevent double entry)
    const existingEnrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: "User is already enrolled in this course" },
        { status: 400 }
      );
    }

    // 3. Create New Enrollment Record
    // This is the most critical part usually missing in admin actions
    const newEnrollment = await Enrollment.create({
      student: userId,
      course: courseId,
      enrolledAt: new Date(),
      status: "active",
      progress: 0,
      completedLectures: [],
      paymentId: "manual_admin_entry", // Marker to know admin added this
      amountPaid: 0,
    });

    // 4. Update User Model
    // Add the course ID to the user's 'courses' array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { courses: courseId },
    });

    // 5. Update Course Model
    // Add the user ID to the course's 'students' array
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: userId },
    });

    return NextResponse.json(
      {
        message: "Enrollment successful",
        enrollment: newEnrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Manual Enrollment Error:", error);
    return NextResponse.json(
      { message: "Failed to enroll user due to server error" },
      { status: 500 }
    );
  }
}
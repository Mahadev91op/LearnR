import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment"; // Import Enrollment Model
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    // 1. Auth Check (Next.js 15 Style)
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    const { courseId } = await req.json();

    // 2. DUPLICATE CHECK (Backend Barrier)
    // Check karein ki kya user pehle se enrolled hai?
    const existingEnrollment = await Enrollment.findOne({
      user: decoded.id,
      course: courseId,
      status: "approved", // Sirf approved walon ko rokenge
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course." }, // Yeh error UI padh lega
        { status: 400 }
      );
    }

    // 3. Normal Flow
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const options = {
      amount: Math.round(course.price * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}_${decoded.id.slice(-4)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order }, { status: 200 });

  } catch (error) {
    console.error("Payment Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
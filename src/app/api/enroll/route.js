import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, courseId, amount, transactionId } = await req.json();

    await Enrollment.create({
      user: userId,
      course: courseId,
      amount,
      transactionId,
    });

    return NextResponse.json({ success: true, message: "Request sent!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Test from "@/models/Test";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // सिर्फ वही टेस्ट लाएं जो ड्राफ्ट नहीं हैं (Scheduled, Live, Completed)
    // scheduledAt के हिसाब से सॉर्ट करें (सबसे पहले होने वाला ऊपर)
    const tests = await Test.find({ 
      courseId: id, 
      status: { $ne: 'draft' } 
    }).sort({ scheduledAt: 1 });

    return NextResponse.json({ success: true, tests });
  } catch (error) {
    console.error("Fetch Tests Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
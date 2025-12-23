// src/app/api/courses/[id]/notices/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notice from "@/models/Notice";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params; // courseId
    
    // Sirf wahi notices layenge jo abhi expire nahi huye hain
    // (Waise MongoDB background me delete kar dega, par safe side ke liye filter laga rahe hain)
    const notices = await Notice.find({ 
        course: id,
        expireAt: { $gt: new Date() } 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, notices });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
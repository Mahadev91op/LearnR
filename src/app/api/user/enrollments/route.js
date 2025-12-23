import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course"; 

// FIX: Cache ko puri tarah disable karne ki settings
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    
    // Step 1: Sabhi Approved Enrollments fetch karein
    const allEnrollments = await Enrollment.find({ 
      user: decoded.id, 
      status: "approved" 
    })
    .populate("course")
    .lean();

    // Step 2: DUPLICATE REMOVER LOGIC
    // Agar user ke paas ek hi course ki 2 approved entries hain, to unhe filter karein
    const uniqueEnrollments = [];
    const seenCourseIds = new Set();

    for (const enrollment of allEnrollments) {
      // Course null nahi hona chahiye aur pehle se list me nahi hona chahiye
      if (enrollment.course && !seenCourseIds.has(enrollment.course._id.toString())) {
        uniqueEnrollments.push(enrollment);
        seenCourseIds.add(enrollment.course._id.toString());
      }
    }

    // Console log to debug
    console.log(`User ${decoded.id}: Found ${allEnrollments.length} raw, Returning ${uniqueEnrollments.length} unique.`);

    // Step 3: Response with No-Cache Headers
    const response = NextResponse.json({ enrollments: uniqueEnrollments }, { status: 200 });
    
    // Browser ko strictly bole ki data store na kare
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;

  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
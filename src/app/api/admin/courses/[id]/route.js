import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // 1. Import name sahi kiya (connectToDatabase -> connectDB)
import Course from "@/models/Course";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    // 2. Next.js 16 FIX: params ko await karna jaruri hai
    const { id } = await params; 
    
    const body = await req.json();

    const updatedCourse = await Course.findByIdAndUpdate(id, body, { new: true });

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course Updated", course: updatedCourse });
  } catch (error) {
    console.error("Update Error:", error); // Console me asli error dikhega
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // 2. Next.js 16 FIX: params ko await karna jaruri hai
    const { id } = await params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course Deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
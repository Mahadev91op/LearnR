import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User"; // User model import kiya cleanup ke liye

// GET: Fetch Single Course
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}

// PUT: Update Course
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; 
    const body = await req.json();

    const updatedCourse = await Course.findByIdAndUpdate(id, body, { new: true });

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course Updated", course: updatedCourse });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Delete Course & Cleanup Users
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // 1. Delete the Course
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Cleanup: Remove this course ID from all Users who enrolled
    await User.updateMany(
      { courses: id },
      { $pull: { courses: id } }
    );

    return NextResponse.json({ message: "Course Deleted & Users Cleaned" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
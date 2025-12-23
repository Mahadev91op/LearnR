import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment"; // FIX: Enrollment model import kiya
import nodemailer from "nodemailer";

// 1. Get Enrolled Students List (No Change)
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const students = await User.find({ courses: id }).select("name email phone createdAt");
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

// 2. Add Student (Manual Enroll) (No Change)
export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; 
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.courses.includes(id)) {
      return NextResponse.json({ error: "User is already enrolled" }, { status: 400 });
    }

    user.courses.push(id);
    await user.save();
    
    // Note: Agar aap chahein to manual add par bhi Enrollment create kar sakte hain, 
    // par abhi ke liye existing logic theek hai.

    const course = await Course.findByIdAndUpdate(id, { $inc: { students: 1 } }, { new: true });

    // Send Welcome Email
    try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email, 
          subject: `🎉 Course Unlocked: ${course.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
              <h2 style="color: #EAB308;">Welcome to LearnR!</h2>
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>You have been enrolled in <strong>${course.title}</strong> by the admin.</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/profile" style="background-color: #EAB308; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
          `
        });
    } catch (e) { console.error("Email failed", e); }

    return NextResponse.json({ message: "Student enrolled", student: user });
  } catch (error) {
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}

// 3. Remove Student & Send Email (UPDATED)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Course ID
    const { studentId } = await req.json();

    if (!studentId) return NextResponse.json({ error: "Student ID required" }, { status: 400 });

    // Step 1: Get User & Course details BEFORE removing
    const user = await User.findById(studentId);
    const course = await Course.findById(id);

    if (!user || !course) return NextResponse.json({ error: "User or Course not found" }, { status: 404 });

    // Step 2: Remove from User & Course Models
    await User.findByIdAndUpdate(studentId, { $pull: { courses: id } });
    await Course.findByIdAndUpdate(id, { $inc: { students: -1 } });

    // FIX: Enrollment collection se bhi record udaa dein
    await Enrollment.findOneAndDelete({ user: studentId, course: id });

    // Step 3: Send Removal Email
    try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email, 
          subject: `Course Access Revoked: ${course.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fff0f0;">
              <h2 style="color: #ef4444;">Access Revoked</h2>
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>Your access to the course <strong>${course.title}</strong> has been removed by the administrator.</p>
              <p>If you think this is a mistake, please contact support.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #888;">Team LearnR</p>
            </div>
          `,
        });
        console.log(`Removal email sent to ${user.email}`);
    } catch (emailError) {
        console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Remove Error:", error);
    return NextResponse.json({ error: "Failed to remove student" }, { status: 500 });
  }
}
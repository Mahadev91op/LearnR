import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment"; // Ensure correct path
import nodemailer from "nodemailer";

// 1. Get Enrolled Students List
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    // Populate students details
    const students = await User.find({ courses: id }).select("name email phone createdAt");
    return NextResponse.json(students);
  } catch (error) {
    console.error("Fetch Students Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

// 2. Add Student (Manual Enroll) - FIXED [Now creates Enrollment]
export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Course ID
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // Find User
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found with this email" }, { status: 404 });

    // Check if already enrolled
    // Convert ObjectIds to strings for comparison to be safe
    const alreadyEnrolled = user.courses.some(courseId => courseId.toString() === id);
    if (alreadyEnrolled) {
      return NextResponse.json({ error: "User is already enrolled in this course" }, { status: 400 });
    }

    // 1. Add Course to User
    user.courses.push(id);
    await user.save();

    // 2. Update Course Student Count & Get Price
    const course = await Course.findByIdAndUpdate(
      id, 
      { $inc: { students: 1 } }, 
      { new: true }
    );

    // 3. Create Enrollment Record (THIS WAS MISSING)
    // We assume manual enrollment means payment is done (Cash/Manual)
    await Enrollment.create({
      user: user._id,
      course: course._id,
      amount: course.price || 0, // Save course price as amount
      status: "approved",        // Directly approve
      transactionId: `MANUAL_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Generate fake Transaction ID
      paymentDate: new Date(),
    });

    // 4. Send Welcome Email
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
              <p>You have been manually enrolled in <strong>${course.title}</strong> by the admin.</p>
              <p>This course is now fully accessible in your dashboard.</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/classroom/${id}" style="display: inline-block; background-color: #EAB308; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Go to Classroom</a>
            </div>
          `
        });
    } catch (e) { console.error("Email failed", e); }

    return NextResponse.json({ message: "Student enrolled successfully", student: user });

  } catch (error) {
    console.error("Manual Enroll Error:", error);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}

// 3. Remove Student & Send Email - FIXED [Removes Enrollment too]
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Course ID
    const { studentId } = await req.json();

    if (!studentId) return NextResponse.json({ error: "Student ID required" }, { status: 400 });

    const user = await User.findById(studentId);
    const course = await Course.findById(id);

    if (!user || !course) return NextResponse.json({ error: "User or Course not found" }, { status: 404 });

    // 1. Remove from User
    await User.findByIdAndUpdate(studentId, { $pull: { courses: id } });
    
    // 2. Remove from Course
    await Course.findByIdAndUpdate(id, { $inc: { students: -1 } });

    // 3. Remove Enrollment Record
    await Enrollment.findOneAndDelete({ user: studentId, course: id });

    // 4. Send Email
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
              <p>Your access to the course <strong>${course.title}</strong> has been removed.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #888;">Team LearnR</p>
            </div>
          `,
        });
    } catch (emailError) { console.error("Email sending failed:", emailError); }

    return NextResponse.json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Remove Error:", error);
    return NextResponse.json({ error: "Failed to remove student" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { enrollmentId, action } = await req.json(); // action can be 'approve' or 'reject'

    if (!enrollmentId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const enrollment = await Enrollment.findById(enrollmentId).populate("user").populate("course");
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // --- CASE 1: APPROVE ---
    if (action === "approve") {
      // 1. Update Status
      enrollment.status = "approved";
      await enrollment.save();

      // 2. Add Course to User Profile (Ab User enroll hoga)
      await User.findByIdAndUpdate(
        enrollment.user._id,
        { $addToSet: { courses: enrollment.course._id } },
        { new: true }
      );

      // 3. Email to User (Approval Success)
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollment.user.email,
        subject: "🎉 Enrollment Approved! - LearnR",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>You are now Enrolled!</h2>
            <p>Congratulations <strong>${enrollment.user.name}</strong>,</p>
            <p>Your enrollment for <strong>${enrollment.course.title}</strong> has been APPROVED by the admin.</p>
            <p>You can now access your course from the dashboard.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #F59E0B; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
          </div>
        `,
      });

      // 4. Email to Admin (Confirmation)
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Enrollment Approved Successfully",
        html: `<p>You successfully approved <strong>${enrollment.user.name}</strong> for <strong>${enrollment.course.title}</strong>.</p>`,
      });

      return NextResponse.json({ success: true, message: "Enrollment Approved" });
    }

    // --- CASE 2: REJECT ---
    else if (action === "reject") {
      // 1. Update Status
      enrollment.status = "rejected";
      await enrollment.save();

      // Note: User ke courses mein add nahi karenge.

      // 2. Email to User (Rejection Notice)
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollment.user.email,
        subject: "Enrollment Status Update - LearnR",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: red;">Enrollment Rejected</h2>
            <p>Hello <strong>${enrollment.user.name}</strong>,</p>
            <p>Your enrollment request for <strong>${enrollment.course.title}</strong> has been rejected by the admin.</p>
            <p>If you think this is a mistake or if you have already paid, please contact support immediately.</p>
            <p>Transaction ID: ${enrollment.transactionId}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact Support</a>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: "Enrollment Rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Admin Action Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
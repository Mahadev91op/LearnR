import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course"; 
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache"; 

export async function POST(req) {
  try {
    await connectDB();
    const { enrollmentId, action } = await req.json();

    // Pehle enrollment dhundhein taaki details mil sakein (Email ke liye)
    const enrollment = await Enrollment.findById(enrollmentId).populate("user").populate("course");
    
    if (!enrollment) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    if (action === "approve") {
      enrollment.status = "approved";
      await enrollment.save();

      // User ke courses list me add karein
      await User.findByIdAndUpdate(enrollment.user._id, {
        $addToSet: { courses: enrollment.course._id }
      });

      // Success Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollment.user.email,
        subject: "🎉 Enrollment Approved!",
        html: `<p>Congrats! You have been enrolled in <strong>${enrollment.course.title}</strong>.</p>`
      });

    } else if (action === "reject") {
      
      // FIX: Status update karne ki jagah SIDHA DELETE kar rahe hain
      await Enrollment.findByIdAndDelete(enrollmentId);

      // Safety: User ke array se bhi course hata dein
      await User.findByIdAndUpdate(enrollment.user._id, {
        $pull: { courses: enrollment.course._id }
      });

      // Rejection Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollment.user.email,
        subject: "Enrollment Rejected",
        html: `<p>Sorry, your enrollment for <strong>${enrollment.course.title}</strong> was rejected.</p>`
      });
    }

    // Cache refresh
    revalidatePath("/dashboard");
    revalidatePath(`/courses/${enrollment.course._id}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Action Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
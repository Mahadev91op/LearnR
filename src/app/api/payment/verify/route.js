import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      userId, 
      courseId,
      amount 
    } = await req.json();

    // ============================================================
    // OPTION 1: REAL VERIFICATION (COMMENTED OUT)
    // Future me jab Razorpay keys aa jaye, tab is block ko uncomment karein
    // aur OPTION 2 (Bypass) ko remove kar dein.
    // ============================================================
    /*
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid Payment Signature" }, { status: 400 });
    }
    */

    // ============================================================
    // OPTION 2: BYPASS VERIFICATION (TEMPORARY)
    // ============================================================
    console.log("BYPASS MODE: Skipping Razorpay signature verification.");
    
    // FIX START: Check Duplicate Enrollment
    // Pehle check karein ki user already enrolled hai ya nahi (Pending ho ya Approved)
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Enrollment already exists! Please check your dashboard." },
        { status: 400 }
      );
    }
    // FIX END

    // 2. Payment Verified -> Save Enrollment (Pending)
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      amount: amount,
      status: "pending", 
      transactionId: razorpay_payment_id, // Fake ID from frontend
    });

    // 3. Email Notification (User & Admin)
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Email to User
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Enrollment Successful (Bypassed) - Waiting for Approval",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Enrollment Request Received</h2>
          <p>We received your request for <strong>${course.title}</strong>.</p>
          <p>This is a manual/bypassed enrollment (Txn ID: ${razorpay_payment_id}).</p>
          <p>Please wait while our admin verifies and approves your enrollment.</p>
        </div>
      `,
    });

    // Email to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin Email
      subject: "New Enrollment Request (Bypassed)",
      html: `
        <p>New Enrollment Request (Razorpay Bypassed)</p>
        <p>User: ${user.name}</p>
        <p>Course: ${course.title}</p>
        <p>Amount: ₹${amount}</p>
        <p>Txn ID: ${razorpay_payment_id}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">Go to Admin Panel</a>
      `,
    });

    return NextResponse.json({ success: true, message: "Payment Verified & Enrollment Created" });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
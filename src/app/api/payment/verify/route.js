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

    // 1. Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid Payment Signature" }, { status: 400 });
    }

    // 2. Payment Verified -> Save Enrollment (Pending)
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      amount: amount,
      status: "pending", // Abhi bhi pending rahega jab tak Admin approve na kare
      transactionId: razorpay_payment_id, // Real Transaction ID
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
      subject: "Payment Received - Waiting for Approval",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Payment Successful!</h2>
          <p>We received your payment of ₹${amount} (Txn ID: ${razorpay_payment_id}).</p>
          <p>Please wait while our admin verifies and approves your enrollment.</p>
        </div>
      `,
    });

    // Email to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin Email
      subject: "New Razorpay Enrollment Request",
      html: `
        <p>New Payment Verified!</p>
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
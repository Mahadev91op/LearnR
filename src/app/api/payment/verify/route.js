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

    // 2. Check Duplicate
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Enrollment already exists! Check dashboard." },
        { status: 400 }
      );
    }

    // 3. Save Enrollment as PENDING (Important Change)
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      amount: amount,
      status: "pending", // Abhi Approved nahi hoga
      transactionId: razorpay_payment_id,
    });

    // NOTE: User model update abhi nahi karenge, wo Admin Action pe hoga.

    // 4. Send Notification Emails (User & Admin)
    try {
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);
      
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        // Email 1: To User (Payment Received, Wait for Approval)
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Payment Successful - Waiting for Approval",
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Payment Received!</h2>
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>We have received your payment of <strong>₹${amount}</strong> for <strong>${course.title}</strong>.</p>
              <p>Your enrollment is currently <strong>PENDING</strong> verification.</p>
              <p>You will receive a confirmation email once the admin approves your request.</p>
              <p>Transaction ID: ${razorpay_payment_id}</p>
            </div>
          `,
        });

        // Email 2: To Admin (Action Required)
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Admin Email
          subject: "ACTION REQUIRED: New Payment Verification",
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Enrollment Request</h2>
              <p>A user has made a payment. Please verify and Approve/Reject.</p>
              <ul>
                <li><strong>User:</strong> ${user.name} (${user.email})</li>
                <li><strong>Course:</strong> ${course.title}</li>
                <li><strong>Amount:</strong> ₹${amount}</li>
                <li><strong>Txn ID:</strong> ${razorpay_payment_id}</li>
              </ul>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/enrollments" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none;">Go to Admin Panel</a>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    return NextResponse.json({ success: true, message: "Payment verified, waiting for approval" });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
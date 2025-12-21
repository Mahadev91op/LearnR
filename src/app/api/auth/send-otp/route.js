import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Check agar user pehle se exist karta hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered. Please Login." }, { status: 400 });
    }

    // 6 Digit OTP Generate karein
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Purana OTP delete karein aur naya save karein
    await Otp.deleteMany({ email });
    await Otp.create({ email, code: otpCode });

    // Email Bhejein
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for LearnR SignUp",
      html: `<p>Your OTP is <strong>${otpCode}</strong>. It expires in 5 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: "OTP Sent!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
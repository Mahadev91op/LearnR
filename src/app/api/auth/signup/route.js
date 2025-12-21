import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, fatherName, phone, email, otp, school, classLevel, password } = body;

    // 1. OTP Check - Schema के हिसाब से 'otp' field का उपयोग किया है
    const validOtp = await Otp.findOne({ email, otp: otp });
    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or Expired OTP" }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    await User.create({
      name,
      fatherName,
      phone,
      email,
      school,
      classLevel,
      password: hashedPassword,
    });

    // 5. Delete OTP after successful signup
    await Otp.deleteMany({ email });

    return NextResponse.json({ success: true, message: "Account Created Successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
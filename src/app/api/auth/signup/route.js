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

    // 1. Verify OTP
    const validOtp = await Otp.findOne({ email, code: otp });
    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or Expired OTP" }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    await User.create({
      name,
      fatherName,
      phone,
      email,
      school,
      classLevel,
      password: hashedPassword,
    });

    // 4. Delete OTP after use
    await Otp.deleteMany({ email });

    return NextResponse.json({ success: true, message: "Account Created Successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
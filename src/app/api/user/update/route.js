import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    
    const body = await request.json();
    const { name, fatherName, phone, school, classLevel, otp } = body;

    await connectDB();
    
    // User को ढूँढें ताकि उसका ईमेल मिल सके
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // --- OTP VERIFICATION ---
    if (!otp) {
        return NextResponse.json({ message: "OTP is required to update profile" }, { status: 400 });
    }

    // Otp model में 'otp' field है, इसलिए वही use करें
    const otpRecord = await Otp.findOne({ email: user.email, otp: otp });

    if (!otpRecord) {
        return NextResponse.json({ message: "Invalid or Expired OTP" }, { status: 400 });
    }
    
    // सफल होने पर OTP डिलीट करें
    await Otp.deleteOne({ _id: otpRecord._id });

    // --- Profile Update ---
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, fatherName, phone, school, classLevel },
      { new: true }
    ).select("-password");

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
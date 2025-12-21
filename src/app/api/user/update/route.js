import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function PUT(request) {
  try {
    // CHANGE: await lagaya hai
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    
    const body = await request.json();
    const { name, fatherName, phone, school, classLevel, otp } = body;

    await connectDB();
    const user = await User.findById(decoded.id);

    // --- OTP VERIFICATION START ---
    if (!otp) {
        return NextResponse.json({ message: "OTP is required" }, { status: 400 });
    }

    const otpRecord = await Otp.findOne({ email: user.email });

    if (!otpRecord || otpRecord.otp !== otp) {
        return NextResponse.json({ message: "Invalid or Expired OTP" }, { status: 400 });
    }
    
    // Delete OTP after successful use
    await Otp.deleteOne({ email: user.email });
    // --- OTP VERIFICATION END ---

    // Update User
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
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db"; // Aapka DB import path check kar lena
import User from "@/models/User";     // Aapka User model path

export async function POST(request) {
  try {
    const token = request.cookies.get("token");

    // 1. Check agar token hi nahi hai
    if (!token) {
      return NextResponse.json(
        { message: "Please login first", success: false },
        { status: 401 }
      );
    }

    // 2. Token Verify karein (Try-Catch ke andar)
    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    } catch (error) {
      // Agar signature invalid hai ya token expire hai
      return NextResponse.json(
        { message: "Invalid Token. Please login again.", success: false },
        { status: 401 }
      );
    }

    // 3. Database connection aur User find
    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // ... Yaha apna OTP bhejne ka code likhein ...
    
    return NextResponse.json({ message: "OTP Sent", success: true });

  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { message: "Server Error", success: false },
      { status: 500 }
    );
  }
}
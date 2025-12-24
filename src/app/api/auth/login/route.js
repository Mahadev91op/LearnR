import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // User Check
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Password Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    // JWT Token Generate (Ye 7 din tak valid hai)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret123", {
      expiresIn: "7d",
    });

    // Cookie set karein
    const response = NextResponse.json({ success: true, message: "Login Successful", user });
    
    // FIX: Yahan 'maxAge' add kiya hai (7 Days in seconds)
    // Ab browser close karne par bhi login rahega
    response.cookies.set("token", token, { 
        httpOnly: true, 
        path: "/",
        maxAge: 7 * 24 * 60 * 60 // 7 Days = 604800 seconds
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
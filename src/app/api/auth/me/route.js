import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Token Verify karein
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "secret123");
    
    // DB se User layein (sirf Name aur Email)
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    // Agar token invalid hai
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
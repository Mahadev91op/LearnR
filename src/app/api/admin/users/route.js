import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Force dynamic ensures we always fetch fresh data
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // lean() makes it faster. courses field ab schema me hai to ye work karega.
    const users = await User.find({})
      .select("name email role courses createdAt") 
      .sort({ createdAt: -1 })
      .lean(); 

    // Agar users null hai to empty array return karein
    if (!users) {
        return NextResponse.json([]);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users Fetch Error:", error);
    // Error object return karne ki jagah empty array return karein taaki page crash na ho
    // Aur console me error check karein
    return NextResponse.json([]); 
  }
}
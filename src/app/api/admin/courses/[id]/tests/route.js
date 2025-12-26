import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // FIXED: Sahi function import kiya
import Test from "@/models/Test";

// GET: Fetch all tests for a course
export async function GET(req, { params }) {
  try {
    await connectDB(); // FIXED: connectToDatabase -> connectDB
    const { id } = await params; 
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    const query = { courseId: id };
    if (type) query.type = type;

    const tests = await Test.find(query).sort({ scheduledAt: -1 });
    return NextResponse.json(tests);
  } catch (error) {
    console.error("GET Tests Error:", error);
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}

// POST: Create a new test
export async function POST(req, { params }) {
  try {
    await connectDB(); // FIXED: connectToDatabase -> connectDB
    const { id } = await params;
    const body = await req.json();

    // 1. Validation
    if (!body.title || !body.scheduledDate || !body.scheduledTime) {
         return NextResponse.json({ error: "Title, Date and Time are required" }, { status: 400 });
    }

    // 2. Date Formatting
    const scheduledAt = new Date(`${body.scheduledDate}T${body.scheduledTime}`);

    // 3. Create Test
    const newTest = await Test.create({
      ...body,
      courseId: id,
      scheduledAt: scheduledAt,
      questions: [],
      status: 'scheduled'
    });

    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    console.error("Test Create Error:", error);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}
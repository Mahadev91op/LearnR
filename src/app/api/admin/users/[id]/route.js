import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course"; 
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const dynamic = 'force-dynamic';

// GET User Details
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("courses")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Single User API Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// UPDATE User Details
export async function PUT(request, { params }) {
    try {
      await connectDB();
      const { id } = await params;
      const body = await request.json();
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // Changes track karein email ke liye
      const changes = [];
      const fieldsToCheck = ['name', 'fatherName', 'phone', 'school', 'classLevel'];
      
      // Basic Fields Update
      fieldsToCheck.forEach(field => {
          if (body[field] !== undefined && body[field] !== user[field]) {
               changes.push(`<b>${field.charAt(0).toUpperCase() + field.slice(1)}</b> changed to: ${body[field]}`);
               user[field] = body[field];
          }
      });

      // Status Update Check
      if (body.isActive !== undefined && body.isActive !== user.isActive) {
          changes.push(`<b>Account Status</b> changed to: ${body.isActive ? 'Active' : 'Deactivated'}`);
          user.isActive = body.isActive;
      }
  
      await user.save();
  
      // Send Email Notification if changes were made
      if (changes.length > 0) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { 
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS 
            },
          });
  
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Profile Update Notification - LearnR",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
                <h2 style="color: #facc15;">Profile Updated by Admin</h2>
                <p>Hello ${user.name},</p>
                <p>The following details in your LearnR account have been updated:</p>
                <ul style="background: #f9f9f9; padding: 15px 30px; border-radius: 5px;">
                  ${changes.map(change => `<li style="margin-bottom: 5px;">${change}</li>`).join('')}
                </ul>
                <p>If you have any questions, please contact support.</p>
              </div>
            `,
          });
      }
  
      return NextResponse.json({ success: true, user });
  
    } catch (error) {
      console.error("Update User API Error:", error);
      return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
  }
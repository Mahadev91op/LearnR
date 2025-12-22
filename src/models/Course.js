import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    students: { type: Number, default: 0 },
    category: { type: String, required: true },
    gradient: { type: String, required: true },
    // New Fields for Admin Control
    isLocked: { type: Boolean, default: false }, // Agar true hai, to enroll nahi kar payenge
    isActive: { type: Boolean, default: true },  // Agar false hai, to course dikhega hi nahi (Draft mode)
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
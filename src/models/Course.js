import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g., "3 Months"
    level: { type: String, required: true }, // e.g., "Beginner", "Class 10"
    rating: { type: Number, default: 4.5 },
    students: { type: Number, default: 0 },
    category: { type: String, required: true }, // e.g., "Grammar", "Speaking"
    gradient: { type: String, required: true }, // Card ka color design
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // स्टूडेंट ने किस सवाल का क्या जवाब दिया
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      selectedOption: { type: Number }, // Index 0-3
    }
  ],
  
  obtainedMarks: { type: Number, default: 0 },
  totalMarks: { type: Number, required: true },
  
  status: { type: String, enum: ['completed', 'auto-submitted'], default: 'completed' },
  submittedAt: { type: Date, default: Date.now }
});

// एक स्टूडेंट एक टेस्ट एक ही बार दे सकता है (Unique Logic)
ResultSchema.index({ testId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
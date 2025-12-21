import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    school: { type: String, required: true },
    classLevel: { type: String, required: true }, // 'Class' reserved keyword hai, isliye 'classLevel' use kiya
    password: { type: String, required: true },
    role: { type: String, default: "student" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
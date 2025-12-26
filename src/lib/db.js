import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Yahan 'export' keyword add kiya hai (Named Export)
export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // FIX: Error handling add kiya hai taaki connection fail hone par retry ho sake
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        // Agar connection fail ho jaye, to promise ko null kar dein
        // Taaki agli request par dobara connect karne ki koshish ho
        cached.promise = null;
        console.error("MongoDB Connection Failed:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Compatibility ke liye default export bhi rehne diya hai
export default connectDB;
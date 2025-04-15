import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("📡 dbConnect called...");

  try {
    if (cached.conn) {
      console.log("✅ Using cached MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      console.log("🔄 Attempting to connect to MongoDB...");

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        console.log("📊 Database name:", mongoose.connection.name);
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    // Clear the cached promise so we can retry
    cached.promise = null;

    // Add more diagnostic information
    if (error.name === "MongoNetworkError") {
      console.error(
        "🌐 Network issue connecting to MongoDB. Check your network or MongoDB URI"
      );
    } else if (error.name === "MongoServerSelectionError") {
      console.error(
        "⏱️ Timed out selecting a MongoDB server. Check if your MongoDB instance is running"
      );
    }

    throw error;
  }
}

export default dbConnect;

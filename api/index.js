import mongoose from "mongoose";
import { createHandler } from "./utils/createHandler";

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");

// Connect to MongoDB
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "login-credentials",
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default createHandler({
  GET: async (req, res) => {
    res.status(200).json({ message: "API is running" });
  },
});

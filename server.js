require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const tmp = require("tmp");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Temporarily allow all origins for debugging
    credentials: true,
  })
);

// Root path handler
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// MongoDB Connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://your-mongodb-uri",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "login-credentials",
      }
    );

    cachedDb = client;
    console.log("✅ Connected to MongoDB Atlas");
    return cachedDb;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "users");

// Proctoring Event Schema
const proctoringEventSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true },
  event: { type: String, required: true },
  timestamp: { type: Date, required: true },
  userId: String,
});

const ProctoringEvent = mongoose.model(
  "ProctoringEvent",
  proctoringEventSchema
);

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({ email, password: hashedPassword }).save();
    console.log("🆕 User created:", newUser._id);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "login-credentials",
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "users");

// =======================
// Auth Routes
// =======================

// Register Route
app.post("/api/register", async (req, res) => {
  try {
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

// =======================
// Code Execution Route
// =======================

app.post("/api/execute", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: "Code and language required" });
  }

  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const filename = getFilename(language);
  const filepath = path.join(tempDir.name, filename);

  try {
    await fs.writeFile(filepath, code);

    const command = getExecutionCommand(language, filepath);

    if (!command) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    exec(
      command,
      { cwd: tempDir.name, timeout: 5000 },
      (err, stdout, stderr) => {
        tempDir.removeCallback(); // Clean up

        if (err) {
          return res.status(400).json({ error: stderr || "Execution error" });
        }

        res.json({ output: stdout });
      }
    );
  } catch (error) {
    console.error("Execution error:", error);
    tempDir.removeCallback();
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// Helper Functions
// =======================

function getFilename(language) {
  switch (language) {
    case "python":
      return "code.py";
    case "cpp":
      return "code.cpp";
    case "c":
      return "code.c";
    case "java":
      return "Main.java";
    case "rust":
      return "main.rs";
    case "javascript":
      return "code.js";
    default:
      return "code.txt";
  }
}

function getExecutionCommand(language, filepath) {
  switch (language) {
    case "python":
      return `python3 ${filepath}`;
    case "cpp":
      return `g++ ${filepath} -o main && ./main`;
    case "c":
      return `gcc ${filepath} -o main && ./main`;
    case "java":
      return `javac ${filepath} && java -cp ${path.dirname(filepath)} Main`;
    case "rust":
      return `rustc ${filepath} -o main && ./main`;
    case "javascript":
      return `node ${filepath}`;
    default:
      return null;
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

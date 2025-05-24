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
    origin:
      process.env.NODE_ENV === "production"
        ? [/\.vercel\.app$/, /localhost/] // Accept any Vercel subdomain and localhost
        : "http://localhost:3000",
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://your-mongodb-uri", {
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
    return res.status(400).json({ error: "Code and language are required" });
  }

  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const filename = getFilename(language);
  const filepath = path.join(tempDir.name, filename);

  try {
    // Create wrapper code for different languages
    const wrappedCode = wrapCodeForExecution(code, language);
    await fs.writeFile(filepath, wrappedCode);

    const command = getExecutionCommand(language, filepath);
    if (!command) {
      tempDir.removeCallback();
      return res.status(400).json({ error: "Unsupported language" });
    }

    exec(
      command,
      { cwd: tempDir.name, timeout: 5000 },
      (err, stdout, stderr) => {
        tempDir.removeCallback(); // Clean up

        if (err) {
          console.error("Execution error:", err);
          return res.status(400).json({
            error: stderr || err.message || "Execution error",
            details: err,
          });
        }

        res.json({
          output: stdout || "Program executed successfully with no output",
        });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    tempDir.removeCallback();
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Add wrapper function for different languages
function wrapCodeForExecution(code, language) {
  switch (language) {
    case "python":
      return `
def main():
    ${code.replace(/\n/g, "\n    ")}

if __name__ == "__main__":
    main()
`;
    case "javascript":
      return `
try {
    ${code}
} catch (error) {
    console.error(error);
}
`;
    case "cpp":
      return `
#include <iostream>
#include <vector>
using namespace std;

${code}

int main() {
    Solution solution;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = solution.twoSum(nums, target);
    for(int i : result) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}
`;
    case "java":
      return `
import java.util.*;

public class Main {
    ${code.replace(/public class Solution \{/, "")}

    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = new int[]{2, 7, 11, 15};
        int target = 9;
        int[] result = solution.twoSum(nums, target);
        for(int i : result) {
            System.out.print(i + " ");
        }
        System.out.println();
    }
}
`;
    case "rust":
      return `
fn main() {
    ${code}
    let nums = vec![2, 7, 11, 15];
    let target = 9;
    let result = two_sum(nums, target);
    println!("{:?}", result);
}
`;
    default:
      return code;
  }
}

// Update execution commands
function getExecutionCommand(language, filepath) {
  const dirname = path.dirname(filepath);

  switch (language) {
    case "python":
      return `python3 "${filepath}"`;
    case "cpp":
      return `g++ "${filepath}" -o "${path.join(
        dirname,
        "main"
      )}" && "${path.join(dirname, "main")}"`;
    case "java":
      return `javac "${filepath}" && java -cp "${dirname}" Main`;
    case "javascript":
      return `node "${filepath}"`;
    case "rust":
      return `rustc "${filepath}" -o "${path.join(
        dirname,
        "main"
      )}" && "${path.join(dirname, "main")}"`;
    default:
      return null;
  }
}

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

// Proctoring Event Route
app.post("/api/log-proctoring-event", async (req, res) => {
  try {
    const { event, timestamp, assessmentId, userId } = req.body;

    const newEvent = new ProctoringEvent({
      event,
      timestamp,
      assessmentId,
      userId,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event logged successfully" });
  } catch (error) {
    console.error("Error logging proctoring event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Export for Vercel
module.exports = app;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

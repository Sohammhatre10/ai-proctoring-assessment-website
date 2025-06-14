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

// Add a basic root route for health checks or initial visits
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [/\.vercel\.app$/, /localhost/, /netlify\.app$/]
        : "http://localhost:5173",
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
  const { code, language, testInput } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const filename = getFilename(language);
  const filepath = path.join(tempDir.name, filename);

  try {
    // Create wrapper code for different languages
    const wrappedCode = wrapCodeForExecution(code, language, testInput);
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

        console.log("Backend Execution STDOUT:", stdout);
        console.log("Backend Execution STDERR:", stderr);

        if (err) {
          console.error("Execution error:", err);
          return res.status(400).json({
            error: stderr || err.message || "Execution error",
            details: err,
          });
        }

        res.json({
          output: stdout || "", // Return actual stdout, let frontend display "No output" if empty
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
function wrapCodeForExecution(code, language, testInput) {
  switch (language) {
    case "python":
      return `
import json

def two_sum_wrapper():
    # Parse testInput: "nums = [2,7,11,15], target = 9"
    parts = "${testInput}".split(", target = ")
    nums_str = parts[0].split(" = ")[1]
    nums = json.loads(nums_str)
    target = int(parts[1])
    
    ${code.replace(/\\n/g, "\\n    ")}
    
    result = two_sum(nums, target)
    print(json.dumps(result, separators=(',', ':')))

if __name__ == "__main__":
    two_sum_wrapper()
`;
    case "javascript":
      return `
try {
    // Parse testInput: "nums = [2,7,11,15], target = 9"
    const testInputString = \`${testInput}\`;
    const numsMatch = testInputString.match(/nums = (\\[.*?\\])/);
    const targetMatch = testInputString.match(/target = (\\d+)/);

    let nums = [];
    let target = 0;

    if (numsMatch && numsMatch[1]) {
        nums = JSON.parse(numsMatch[1]);
    }
    if (targetMatch && targetMatch[1]) {
        target = parseInt(targetMatch[1], 10);
    }
    
    ${code}
    
    const result = twoSum(nums, target);
    console.log(JSON.stringify(result));
} catch (error) {
    console.error(error);
}
`;
    case "cpp":
      return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm> // For std::remove

using namespace std;

// Helper function to parse vector<int> from string like "[1,2,3]"
vector<int> parseVector(const string& s) {
    vector<int> vec;
    if (s.empty() || s == "[]") return vec;
    string cleaned_s = s;
    cleaned_s.erase(remove(cleaned_s.begin(), cleaned_s.end(), '['), cleaned_s.end());
    cleaned_s.erase(remove(cleaned_s.begin(), cleaned_s.end(), ']'), cleaned_s.end());
    stringstream ss(cleaned_s);
    string item;
    while (getline(ss, item, ',')) {
        vec.push_back(stoi(item));
    }
    return vec;
}

${code}

int main() {
    Solution solution;
    // Parse testInput: "nums = [2,7,11,15], target = 9"
    string testInputStr = "${testInput}";
    
    size_t nums_start = testInputStr.find("nums = ");
    size_t target_start = testInputStr.find(", target = ");

    string nums_str = testInputStr.substr(nums_start + 7, target_start - (nums_start + 7));
    string target_str = testInputStr.substr(target_start + 11);

    vector<int> nums = parseVector(nums_str);
    int target = stoi(target_str);
    
    vector<int> result = solution.twoSum(nums, target);
    cout << "[";
    for(size_t i = 0; i < result.size(); ++i) {
        cout << result[i];
        if (i < result.size() - 1) {
            cout << ",";
        }
    }
    cout << "]" << endl;
    return 0;
}
`;
    case "java":
      return `
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    // Helper function to parse int array from string like "[1,2,3]"
    public static int[] parseIntArray(String s) {
        if (s == null || s.trim().isEmpty() || s.equals("[]")) {
            return new int[0];
        }
        String cleanedS = s.substring(1, s.length() - 1); // Remove brackets
        String[] items = cleanedS.split(",");
        int[] arr = new int[items.length];
        for (int i = 0; i < items.length; i++) {
            arr[i] = Integer.parseInt(items[i].trim());
        }
        return arr;
    }

    ${code.replace(/public class Solution \\{/, "")}

    public static void main(String[] args) {
        Solution solution = new Solution();
        // Parse testInput: "nums = [2,7,11,15], target = 9"
        String testInputStr = "${testInput}";
        
        Pattern numsPattern = Pattern.compile("nums = (\\[.*?\\])");
        Matcher numsMatcher = numsPattern.matcher(testInputStr);
        String nums_str = "";
        if (numsMatcher.find()) {
            nums_str = numsMatcher.group(1);
        }

        Pattern targetPattern = Pattern.compile("target = (\\\\d+)");
        Matcher targetMatcher = targetPattern.matcher(testInputStr);
        int target = 0;
        if (targetMatcher.find()) {
            target = Integer.parseInt(targetMatcher.group(1));
        }

        int[] nums = parseIntArray(nums_str);
        
        int[] result = solution.twoSum(nums, target);
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) {
                System.out.print(",");
            }
        }
        System.out.println("]");
    }
}
`;
    case "rust":
      return `
fn main() {
    // Parse testInput: "nums = [2,7,11,15], target = 9"
    let test_input_str = "${testInput}";
    
    let parts: Vec<&str> = test_input_str.split(", target = ").collect();
    let nums_str = parts[0].trim_start_matches("nums = ").trim();
    let target_str = parts[1].trim();

    let nums: Vec<i32> = nums_str
        .trim_matches(\'[\')
        .trim_matches(\']\')
        .split(\',\')
        .filter_map(|s| s.trim().parse().ok())
        .collect();
    
    let target: i32 = target_str.parse().unwrap();

    ${code}
    
    let result = two_sum(nums, target);
    // Format result as a JSON array string without spaces
    let mut output = String::from("[");
    for (i, &val) in result.iter().enumerate() {
        output.push_str(&val.to_string());
        if i < result.len() - 1 {
            output.push_str(",");
        }
    }
    output.push_str("]");
    println!("{}", output);
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

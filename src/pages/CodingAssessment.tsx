import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Moon,
  Sun,
  Play,
  CheckCircle,
  Camera,
  CameraOff,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import Editor from "react-simple-code-editor";
import Webcam from "react-webcam";
import { useTheme } from "../context/ThemeContext";

// Import Prism core
import Prism from "prismjs";
import "prismjs/components/prism-clike"; // base for many C-like languages
import "prismjs/components/prism-c"; // ✅ required before C++
import "prismjs/components/prism-cpp"; // depends on `c`
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";

// Initialize Prism
if (typeof window !== "undefined") {
  Prism.manual = true;
}

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "rust";

const CodingAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme, toggleTheme } = useTheme();

  const [code, setCode] = useState(`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [seconds, setSeconds] = useState(1800);
  const [language, setLanguage] = useState<SupportedLanguage>("cpp");
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const placeholderCode: Record<string, string> = {
    javascript: `function twoSum(nums, target) {
  // Your code here
}`,
    python: `def two_sum(nums, target):\n    # Your code here`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`,
    java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
    rust: `fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    // Your code here
}`,
  };

  useEffect(() => {
    console.log("Current assessment ID:", id);
    // You can use this ID to fetch the specific problem data
    // For now, we'll just log it
  }, [id]);

  useEffect(() => {
    console.log("Language changed to:", language);
    setCode(placeholderCode[language]);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  const formatTime = (time: number): string =>
    `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
      time % 60
    ).padStart(2, "0")}`;

  const handleRun = async () => {
    console.log("Run button clicked");
    setIsRunning(true);
    setExecutionResult(null);
    setExecutionError(null);

    try {
      const response = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Execution failed");
      }

      setExecutionResult(data.output);
    } catch (error) {
      setExecutionError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsRunning(false);
    }
  };

  const testCases = [
    { id: 1, input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
    { id: 2, input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
    { id: 3, input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" },
  ];

  const handleHighlight = (code: string) => {
    try {
      return Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.plain,
        language
      );
    } catch (error) {
      console.error("Highlighting error:", error);
      return code;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 border-b py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 w-8 h-8 rounded flex justify-center items-center text-white font-bold">
            CA
          </div>
          <span className="font-semibold text-lg text-cyan-600 dark:text-cyan-400">
            CodingAssessment
          </span>
          <span className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
            Problem {id}/10
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
            <Clock size={16} />
            <span className="font-mono">{formatTime(seconds)}</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-800"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 h-[calc(100vh-56px)]">
        <div className="lg:col-span-8 border-r dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">{id}. Two Sum</h1>
              <span className="text-xs bg-green-500 dark:bg-green-600 text-white rounded px-2 py-1">
                Easy
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Given an array of integers <code>nums</code> and an integer{" "}
              <code>target</code>, return indices of the two numbers such that
              they add up to <code>target</code>. Each input has exactly one
              solution, and you may not use the same element twice.
            </p>
          </div>
          <div className="flex-1 p-4">
            <div className="h-full border rounded bg-white dark:bg-gray-800">
              <div className="p-2 flex justify-between items-center border-b dark:border-gray-700">
                <select
                  onChange={(e) => {
                    setLanguage(e.target.value as SupportedLanguage);
                  }}
                  value={language}
                  className="bg-white dark:bg-gray-700 border px-2 py-1 rounded"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="rust">Rust</option>
                </select>
                <div className="flex gap-2">
                  <button className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    Format
                  </button>
                  <button
                    className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                    onClick={() => setCode(placeholderCode[language])}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={handleHighlight}
                padding={10}
                style={{
                  fontFamily: "Fira Code, monospace",
                  fontSize: 14,
                  height: "calc(100% - 120px)",
                }}
              />
              {(executionResult || executionError) && (
                <div className="border-t dark:border-gray-700 p-4">
                  <h3 className="text-sm font-medium mb-2">
                    {executionError ? "Error" : "Output"}
                  </h3>
                  <pre
                    className={`text-xs p-2 rounded ${
                      executionError
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {executionError || executionResult || "No output"}
                  </pre>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 flex justify-between border-t dark:border-gray-700">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`${
                isRunning ? "bg-cyan-400" : "bg-cyan-600"
              } text-white px-4 py-2 rounded flex items-center gap-2`}
            >
              <Play size={16} /> {isRunning ? "Running..." : "Run"}
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <CheckCircle size={16} /> Submit
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 border rounded">
            <h2 className="px-4 py-3 border-b dark:border-gray-700 text-sm font-medium">
              Test Cases
            </h2>
            {testCases.map((tc) => (
              <div key={tc.id}>
                <button
                  onClick={() =>
                    setExpandedCase(expandedCase === tc.id ? null : tc.id)
                  }
                  className="w-full text-left px-4 py-2 flex justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>Case {tc.id}</span>
                  {expandedCase === tc.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedCase === tc.id && (
                  <div className="px-4 py-2 text-xs">
                    <p className="text-gray-500 dark:text-gray-400">Input:</p>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {tc.input}
                    </pre>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Expected Output:
                    </p>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 border rounded">
            <div className="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-sm font-medium">Webcam Monitor</h3>
              <button
                onClick={() => setIsWebcamEnabled(!isWebcamEnabled)}
                className="text-cyan-600 dark:text-cyan-400"
              >
                {isWebcamEnabled ? (
                  <CameraOff size={16} />
                ) : (
                  <Camera size={16} />
                )}
              </button>
            </div>
            <div className="p-4 h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              {isWebcamEnabled ? (
                <Webcam
                  audio={false}
                  height={160}
                  width={240}
                  screenshotFormat="image/jpeg"
                  className="rounded border"
                />
              ) : (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <Camera size={24} className="mx-auto mb-2" />
                  <p>Camera is disabled</p>
                  <button
                    onClick={() => setIsWebcamEnabled(true)}
                    className="mt-2 px-3 py-1 bg-cyan-600 text-white rounded text-xs"
                  >
                    Enable Camera
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Play, CheckCircle, Camera, CameraOff, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import Webcam from 'react-webcam';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism.css';

const CodingAssessment = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [code, setCode] = useState(`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedCase, setExpandedCase] = useState(0);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [seconds, setSeconds] = useState(1800); // 30 minutes

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds(s => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1500);
  };

  const testCases = [
    {
      id: 1,
      input: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]'
    },
    {
      id: 2,
      input: 'nums = [3,2,4], target = 6',
      expectedOutput: '[1,2]'
    },
    {
      id: 3,
      input: 'nums = [3,3], target = 6',
      expectedOutput: '[0,1]'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-cyan-600 flex items-center justify-center text-white font-bold">
              CA
            </div>
            <span className="font-semibold text-lg text-cyan-600 dark:text-cyan-400">
              CodingAssessment
            </span>
          </div>
          <div className="hidden md:flex text-sm text-gray-600 dark:text-gray-300">
            Problem 1/10
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-cyan-600 dark:text-cyan-400" />
            <span className="font-mono text-cyan-600 dark:text-cyan-400">
              {formatTime(seconds)}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200 
                      hover:bg-cyan-200 dark:hover:bg-cyan-700 transition-colors duration-200"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-56px)]">
        {/* Problem Description + Editor */}
        <div className="lg:col-span-8 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">1. Two Sum</h1>
                <span className="bg-green-500 dark:bg-green-600 px-2 py-1 rounded text-xs text-white font-medium">
                  Easy
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert">
                <p>
                  Given an array of integers <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-cyan-700 dark:text-cyan-300">nums</code> and an integer <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-cyan-700 dark:text-cyan-300">target</code>, 
                  return <em>indices of the two numbers</em> such that they add up to <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-cyan-700 dark:text-cyan-300">target</code>.
                </p>
                <p className="mt-2">
                  You may assume that each input would have <strong>exactly one solution</strong>, and 
                  you may not use the <em>same</em> element twice.
                </p>
                <p className="mt-2">
                  You can return the answer in any order.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="h-full w-full border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800">
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                <select 
                  className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
                  defaultValue="cpp"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                    Format
                  </button>
                  <button className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                    Reset
                  </button>
                </div>
              </div>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={code => highlight(code, languages.cpp, 'cpp')}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 14,
                  height: '100%',
                  backgroundColor: 'transparent',
                }}
                className="min-h-[300px] h-full"
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
            <div>
              <button 
                onClick={handleRun}
                disabled={isRunning}
                className="mr-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md flex items-center gap-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Play size={16} />
                <span>Run</span>
              </button>
            </div>
            <button 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1 transition-colors"
            >
              <CheckCircle size={16} />
              <span>Submit</span>
            </button>
          </div>
        </div>
        
        {/* Test Cases + Webcam */}
        <div className="lg:col-span-4 p-4 bg-gray-50 dark:bg-gray-900 flex flex-col gap-4 overflow-y-auto">
          {/* Test Cases */}
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">Test Cases</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {testCases.map((testCase) => (
                <div key={testCase.id} className="text-sm">
                  <button
                    onClick={() => setExpandedCase(expandedCase === testCase.id ? null : testCase.id)}
                    className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Case {testCase.id}
                    </span>
                    {expandedCase === testCase.id ? (
                      <ChevronUp size={16} className="text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  
                  {expandedCase === testCase.id && (
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs">
                      <div className="mb-2">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Input:</p>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 overflow-x-auto">
                          {testCase.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Expected Output:</p>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-800 dark:text-gray-200 overflow-x-auto">
                          {testCase.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Webcam Monitor */}
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Webcam Monitor</h3>
              <button 
                onClick={() => setIsWebcamEnabled(!isWebcamEnabled)}
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
              >
                {isWebcamEnabled ? (
                  <CameraOff size={16} />
                ) : (
                  <Camera size={16} />
                )}
              </button>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center">
              {isWebcamEnabled ? (
                <Webcam
                  audio={false}
                  height={160}
                  width={240}
                  screenshotFormat="image/jpeg"
                  className="rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Camera size={24} className="mx-auto mb-2 opacity-50" />
                  <p>Camera is disabled</p>
                  <button 
                    onClick={() => setIsWebcamEnabled(true)}
                    className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-xs transition-colors"
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
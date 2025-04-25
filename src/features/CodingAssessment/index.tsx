import React, { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';
import ProblemDescription from './components/ProblemDescription';
import CodeEditor from './components/CodeEditor';
import TestCases from './components/TestCases';
import WebcamMonitor from './components/WebcamMonitor';
import ThemeToggle from '../../components/ThemeToggle';
import Timer from './components/Timer';

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

const defaultCode = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`;

const CodingAssessment: React.FC = () => {
  const [code, setCode] = useState(defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRun = () => {
    setIsRunning(true);
    // Simulate running code
    setTimeout(() => {
      setIsRunning(false);
    }, 1500);
  };
  
  const handleSubmit = () => {
    // Handle submission logic
  };

  const problemDescription = (
    <>
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
      
      <h3 className="font-medium mt-4 mb-2">Example 1:</h3>
      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <strong>Input:</strong> nums = [2,7,11,15], target = 9
        <br />
        <strong>Output:</strong> [0,1]
        <br />
        <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
      </pre>
      
      <h3 className="font-medium mt-4 mb-2">Example 2:</h3>
      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <strong>Input:</strong> nums = [3,2,4], target = 6
        <br />
        <strong>Output:</strong> [1,2]
      </pre>
      
      <h3 className="font-medium mt-4 mb-2">Example 3:</h3>
      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <strong>Input:</strong> nums = [3,3], target = 6
        <br />
        <strong>Output:</strong> [0,1]
      </pre>
      
      <h3 className="font-medium mt-4 mb-2">Constraints:</h3>
      <ul className="list-disc pl-5">
        <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
        <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
        <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
        <li><strong>Only one valid answer exists.</strong></li>
      </ul>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
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
          <Timer initialMinutes={30} />
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-56px)]">
        {/* Problem Description + Editor */}
        <div className="lg:col-span-8 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <ProblemDescription 
            title="1. Two Sum" 
            description={problemDescription}
            difficulty="Easy"
          />
          
          <div className="flex-1 p-4 flex flex-col">
            <CodeEditor 
              defaultValue={code} 
              language="cpp" 
              onChange={setCode}
            />
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
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1 transition-colors"
            >
              <CheckCircle size={16} />
              <span>Submit</span>
            </button>
          </div>
        </div>
        
        {/* Test Cases + Webcam */}
        <div className="lg:col-span-4 p-4 bg-gray-50 dark:bg-gray-900 flex flex-col gap-4 overflow-y-auto">
          <TestCases testCases={testCases} />
          <WebcamMonitor />
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;
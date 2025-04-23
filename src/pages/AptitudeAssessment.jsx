import React from "react";
import Webcam from "react-webcam";

export default function AptitudeAssessment() {
  return (
    <div className="flex h-screen bg-blue-50 p-4 overflow-hidden">
      <div className="flex-1 p-4">
        <div className="flex justify-center mb-4">
          <div className="bg-white py-1 px-6 rounded-full shadow">Timer</div>
        </div>
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Question-1</h2>
          <p className="text-center">Sample Question</p>
        </div>
        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map((opt) => (
            <button
              key={opt}
              className="flex items-center justify-center w-10 h-10 rounded-full border bg-gray-300 hover:bg-gray-400"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="w-96 border-l px-4 overflow-y-auto">
        <div className="flex justify-end p-2">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">👤</div>
        </div>
        <div className="bg-gray-300 rounded p-4 mb-4 text-center">Webcam feed
          <Webcam
            audio={false}
            height={180}
            screenshotFormat="image/jpeg"
            width={250}
            className="rounded mt-2 mx-auto"
          />
        </div>
        <div className="bg-gray-300 rounded p-4 text-center">Calculator</div>
      </div>
    </div>
  );
}
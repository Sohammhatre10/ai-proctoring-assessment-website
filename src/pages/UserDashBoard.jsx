import React from "react";

export default function UserDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <div className="space-y-4">
        <button className="bg-blue-600 text-white p-3 rounded">Start Coding Assessment</button>
        <button className="bg-yellow-600 text-white p-3 rounded">Start Aptitude Assessment</button>
      </div>
    </div>
  );
}
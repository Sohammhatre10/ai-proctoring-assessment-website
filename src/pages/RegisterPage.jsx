import React from "react";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input type="text" placeholder="Name" className="mb-4 p-2 w-full border rounded" />
        <input type="email" placeholder="Email" className="mb-4 p-2 w-full border rounded" />
        <input type="password" placeholder="Password" className="mb-4 p-2 w-full border rounded" />
        <button className="bg-green-500 text-white p-2 w-full rounded">Register</button>
      </div>
    </div>
  );
}
import React from "react";

const UsageStats = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Model Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">3</p>
          <p>Trained Models</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">0</p>
          <p>Deployed Models</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">0</p>
          <p>Total Requests</p>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;

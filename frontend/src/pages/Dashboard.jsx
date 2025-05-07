import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-10 bg-gray-50 w-full min-h-screen">
        <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => navigate("/ingest")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:cursor-pointer hover:bg-blue-700"
          >
            Upload Dataset
          </button>
          {/* <button
            disabled
            className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow cursor-not-allowed"
          >
            Train New Model (Complete upload flow first)
          </button> */}
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-2xl font-bold">3</p>
            <p>Trained Models</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-2xl font-bold">0</p>
            <p>Deployed Models</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-2xl font-bold">0</p>
            <p>Total API Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

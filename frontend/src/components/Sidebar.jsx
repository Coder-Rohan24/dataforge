import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Database, LayoutDashboard, Server } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg fixed top-0 left-0 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center space-x-3 mb-8">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-800">AI DataForge</h1>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className={`flex items-center space-x-2 p-2 rounded ${isActive("/dashboard")}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/models" className={`flex items-center space-x-2 p-2 rounded ${isActive("/models")}`}>
            <Server size={20} />
            <span>Models</span>
          </Link>
          <Link to="/datasets" className={`flex items-center space-x-2 p-2 rounded ${isActive("/datasets")}`}>
            <Database size={20} />
            <span>Datasets</span>
          </Link>
          <Link to="/profile" className={`flex items-center space-x-2 p-2 rounded ${isActive("/profile")}`}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition p-2"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;

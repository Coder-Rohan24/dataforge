import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileDetails from "../components/ProfileDetails";
import PasswordChange from "../components/PasswordChange";
import UsageStats from "../components/UsageStats";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-10 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-semibold mb-6">My Profile</h2>
        <ProfileDetails />
        <PasswordChange />
        <UsageStats />
      </div>
    </div>
  );
};

export default Profile;

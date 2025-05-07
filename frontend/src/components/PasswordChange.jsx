import React from "react";

const PasswordChange = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Change Password</h3>
      <form className="space-y-4">
        <input type="password" placeholder="Current Password" className="w-full border p-2 rounded" />
        <input type="password" placeholder="New Password" className="w-full border p-2 rounded" />
        <input type="password" placeholder="Confirm New Password" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;

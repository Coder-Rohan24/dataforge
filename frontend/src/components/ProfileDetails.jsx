import React, { useState } from "react";

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // You’d normally call an API here to update user profile
    console.log("Updated user", user);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">User Details</h3>
        <button
          className="text-blue-600 font-medium"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border rounded p-2 bg-gray-100"
        />
        <label className="block text-sm font-medium mt-2">Email</label>
        <input
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border rounded p-2 bg-gray-100"
        />
        {isEditing && (
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;

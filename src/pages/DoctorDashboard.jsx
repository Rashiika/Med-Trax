import React from "react";
import { useSelector } from "react-redux";

const DoctorDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Doctor Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg mb-2">Welcome, {user?.email}!</p>
          <p className="text-gray-600">Your doctor dashboard is under construction.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
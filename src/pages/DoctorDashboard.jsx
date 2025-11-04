import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DashboardLayout } from "../components/Layout/DashboardLayout";
import axiosInstance from "../api/axiosInstance";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axiosInstance.get('/doctor/dashboard/stats/');
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if doctor is new (no appointments)
  const isNewUser = stats?.total_appointments === 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {isNewUser ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center border-l-4 border-teal-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome Dr. {user?.email}! 🩺
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Your doctor dashboard is ready. Patients can now book appointments with you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-700 mb-2">📅 Manage Appointments</h3>
                <p className="text-sm text-gray-600">View and manage patient appointments</p>
              </div>
              
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h3 className="font-semibold text-cyan-700 mb-2">💬 Chat with Patients</h3>
                <p className="text-sm text-gray-600">Communicate with your patients</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">👤 Update Profile</h3>
                <p className="text-sm text-gray-600">Keep your profile information current</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-teal-500 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back, Dr. {user?.email}!
              </h2>
              <p className="text-gray-600">Here's your practice overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
                <p className="text-sm text-gray-600 font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.total_appointments || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <p className="text-sm text-gray-600 font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.today_appointments || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.total_patients || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <p className="text-sm text-gray-600 font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.pending_reviews || 0}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
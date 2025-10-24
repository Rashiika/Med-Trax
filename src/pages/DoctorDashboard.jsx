import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import logo from "../assets/logo.png";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user && !user.profile_completed) {
      navigate("/complete-doctor-profile", { replace: true });
      return;
    }

    if (user && user.role !== "doctor") {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Med-Trax" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold text-blue-700">Med-Trax</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-lg font-semibold text-gray-800">
                  Dr. {user.username || user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Doctor Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your appointments, patients, and medical records
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <DashboardCard
            title="Appointments"
            value="0"
            description="Scheduled appointments"
            icon="📅"
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <DashboardCard
            title="Patients"
            value="0"
            description="Total registered patients"
            icon="👥"
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <DashboardCard
            title="Records"
            value="0"
            description="Medical records maintained"
            icon="📋"
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton icon="➕" label="New Appointment" />
            <ActionButton icon="👤" label="Add Patient" />
            <ActionButton icon="📝" label="Write Prescription" />
            <ActionButton icon="📊" label="View Reports" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, value, description, icon, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl p-6 border border-gray-200`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${textColor} mb-1`}>{value}</p>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const ActionButton = ({ icon, label }) => (
  <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

export default DoctorDashboard;
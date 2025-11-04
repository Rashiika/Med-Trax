import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DashboardLayout } from "../components/Layout/DashboardLayout";
import axiosInstance from "../api/axiosInstance";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, upcomingRes, recentRes] = await Promise.all([
        axiosInstance.get('/patient/dashboard/stats/'),
        axiosInstance.get('/patient/dashboard/appointments/'),
        axiosInstance.get('/patient/dashboard/appointments/recent/')
      ]);

      setStats(statsRes.data);
      setUpcomingAppointments(upcomingRes.data);
      setRecentAppointments(recentRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
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
        {/* Show different content based on isNewUser */}
        {isNewUser ? (
          // NEW USER - Welcome Screen
          <div className="bg-white rounded-lg shadow-lg p-12 text-center border-l-4 border-teal-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Your Dashboard, {user?.email}! 🎉
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              You're all set! Start by booking your first appointment with our doctors.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-700 mb-2">📅 Book Appointment</h3>
                <p className="text-sm text-gray-600">Schedule a consultation with our specialists</p>
              </div>
              
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h3 className="font-semibold text-cyan-700 mb-2">💬 Chat with Doctors</h3>
                <p className="text-sm text-gray-600">Connect with healthcare professionals</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">👤 Complete Profile</h3>
                <p className="text-sm text-gray-600">Add medical history and details</p>
              </div>
            </div>
          </div>
        ) : (
          // EXISTING USER - Show Real Data
          <>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-teal-500 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.email}!
              </h2>
              <p className="text-gray-600">Here's your health summary</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
                <p className="text-sm text-gray-600 font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.total_appointments || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <p className="text-sm text-gray-600 font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.upcoming || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.completed || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.pending || 0}</p>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{apt.doctor_name}</p>
                        <p className="text-sm text-gray-600">{apt.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.date}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              )}
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h3>
              {recentAppointments.length > 0 ? (
                <div className="space-y-3">
                  {recentAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{apt.doctor_name}</p>
                        <p className="text-sm text-gray-600">{apt.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.date}</p>
                        <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent appointments</p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
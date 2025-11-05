import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';

const homeIcon = '🏠';
const appointmentIcon = '📅';
const chatsIcon = '💬';
const communityIcon = '👥';
const profileIcon = '⚙️';

// ✅ Updated sidebar items to match App.jsx routes
const doctorSidebarItems = [
  { label: 'Home', to: '/doctor/dashboard', icon: homeIcon },
  { label: 'Appointments', to: '/doctor/appointments', icon: appointmentIcon },
  { label: 'Chats', to: '/doctor/chats', icon: chatsIcon },
  { label: 'Community', to: '/doctor/community', icon: communityIcon },
  { label: 'Profile', to: '/doctor/profile', icon: profileIcon },
];

const DoctorDashboard = () => {
    return (
        <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome to Doctor Dashboard! 👨‍⚕️
                    </h2>
                    <p className="text-gray-600">Manage your appointments and patients</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                        <p className="text-sm text-gray-600 font-medium">Today's Appointments</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600 font-medium">Pending Requests</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-600 font-medium">Total Patients</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">42</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                        <p className="text-sm text-gray-600 font-medium">Completed Today</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                            <h4 className="font-semibold text-blue-700">📅 View Appointments</h4>
                            <p className="text-sm text-gray-600">Manage your schedule</p>
                        </button>
                        <button className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                            <h4 className="font-semibold text-green-700">👥 Patient Records</h4>
                            <p className="text-sm text-gray-600">Access patient information</p>
                        </button>
                        <button className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                            <h4 className="font-semibold text-purple-700">💬 Messages</h4>
                            <p className="text-sm text-gray-600">Chat with patients</p>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-bold">JD</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">John Doe</p>
                                    <p className="text-sm text-gray-500">Appointment completed</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">2 min ago</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">MS</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Mary Smith</p>
                                    <p className="text-sm text-gray-500">New appointment request</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">15 min ago</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-600 font-bold">AB</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Alice Brown</p>
                                    <p className="text-sm text-gray-500">Message received</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">1 hour ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorDashboard;
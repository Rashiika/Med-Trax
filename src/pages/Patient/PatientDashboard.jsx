import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    fetchPatientStats,
    fetchPatientAppointments,
    fetchPatientRecentAppointments
} from "../../redux/features/appointmentSlice";

import { fetchPatientChats } from "../../redux/features/chatSlice";

import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";
import { FileText } from "lucide-react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

const patientSidebarItems = [
    { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/patient/chats", icon: chatsIcon },
    { label: "Prescriptions", to: "/patient/prescriptions", icon: <FileText className="w-5 h-5" /> },
    { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
    { label: "Profile", to: "/patient/profile", icon: profileIcon }
];

const PatientDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const {
        patientStats: stats,
        upcomingAppointments,
        recentAppointments,
        loading: appointmentLoading,
        error: appointmentError
    } = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchPatientStats());
        dispatch(fetchPatientAppointments());
        dispatch(fetchPatientRecentAppointments());
        dispatch(fetchPatientChats());

        const interval = setInterval(() => {
            dispatch(fetchPatientStats());
            dispatch(fetchPatientAppointments());
            dispatch(fetchPatientRecentAppointments());
            dispatch(fetchPatientChats());
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch]);

    const isLoading = appointmentLoading || stats === null;
    const isNewUser = stats?.total_appointments === 0;
    const displayName = user?.email || "User";

    if (isLoading) {
        return (
            <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (appointmentError) {
        return (
            <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
                <div className="text-red-600 text-center p-8">
                    Error loading dashboard data.
                    <p className="text-sm text-gray-500 mt-2">
                        {JSON.stringify(appointmentError)}
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
            <div className="max-w-7xl mx-auto">
                {isNewUser ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center border-l-4 border-teal-500">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Welcome to Your Dashboard, {displayName}
                        </h2>

                        <p className="text-gray-600 text-lg mb-8">
                            Start by booking your first appointment.
                        </p>

                        <div className="mb-4">
                            <button
                                onClick={() => {
                                    dispatch(fetchPatientStats());
                                    dispatch(fetchPatientAppointments());
                                    dispatch(fetchPatientChats());
                                }}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                            >
                                Refresh Dashboard
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                                <h3 className="font-semibold text-teal-700 mb-2">Book Appointment</h3>
                                <p className="text-sm text-gray-600">Schedule a consultation</p>
                            </div>

                            <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                                <h3 className="font-semibold text-cyan-700 mb-2">Chat with Doctors</h3>
                                <p className="text-sm text-gray-600">Connect instantly</p>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-700 mb-2">Complete Profile</h3>
                                <p className="text-sm text-gray-600">Update your details</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-teal-500 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Welcome back, {displayName}
                            </h2>
                            <p className="text-gray-600">Here is your health summary</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <StatCard label="Total Appointments" value={stats?.total_appointments} color="teal" />
                            <StatCard label="Upcoming" value={stats?.upcoming} color="green" />
                            <StatCard label="Completed" value={stats?.completed} color="blue" />
                            <StatCard label="Pending" value={stats?.pending} color="yellow" />
                        </div>

                        <Section
                            title="Upcoming Appointments"
                            data={upcomingAppointments}
                            emptyText="No upcoming appointments"
                        />

                        <Section
                            title="Recent Appointments"
                            data={recentAppointments}
                            emptyText="No recent appointments"
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${color}-500`}>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value || 0}</p>
    </div>
);

const Section = ({ title, data, emptyText }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>

        {data && data.length > 0 ? (
            <div className="space-y-3">
                {data.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-800">{apt?.doctor_name}</p>
                            <p className="text-sm text-gray-600">{apt?.specialization}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">{apt?.date}</p>
                            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                                {apt?.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">{emptyText}</p>
        )}
    </div>
);

export default PatientDashboard;
import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, User, AlertTriangle, MessageSquare, Users, LogOut, Menu, X, Loader2, ArrowUp, Star, BarChart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctorRequests, fetchDoctorConfirmedAppointments, acceptAppointmentRequest, rejectAppointmentRequest, fetchDoctorStats, fetchDoctorWeeklyStats, fetchDoctorRecentReviews } from "../../redux/features/appointmentSlice";
import { showToast } from "../../components/Toast"; 
import DashboardLayout from '../../components/Layout/DashboardLayout'; 
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';

const doctorSidebarItems = [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: homeIcon },
    { label: 'Appointments', to: '/doctor/appointments', icon: appointmentIcon },
    { label: 'Chats', to: '/doctor/chats', icon: chatsIcon },
    { label: 'Blogs', to: '/doctor/blogs', icon: blogIcon },
    { label: 'Profile', to: '/doctor/profile', icon: profileIcon },
];


const WeeklyPatientChart = ({ weeklyStats, totalWeek }) => {
    if (!weeklyStats || weeklyStats.length === 0) {
        return <p className="text-center text-gray-500 py-4">No patient data available this week.</p>;
    }

    const maxPatients = Math.max(...weeklyStats.map(d => d.patient_count)) || 1;

    return (
        <div className="pt-4">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-blue-600" />
                Weekly Patient Count ({totalWeek} Total)
            </h4>
            <div className="flex justify-between items-end h-40 space-x-2 border-b border-gray-200 pt-4">
                {weeklyStats.map((day) => (
                    <div key={day.date} className="flex flex-col items-center group relative w-full h-full justify-end">
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity">
                            {day.day_short}: {day.patient_count} Patients
                        </div>
                        <div 
                            className="w-4 sm:w-6 rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-300 hover:shadow-lg"
                            style={{ height: `${(day.patient_count / maxPatients) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{day.day_name.substring(0, 3)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const DoctorDashboard = () => {
    const dispatch = useDispatch();
    
    const { user, loading: authLoading } = useSelector((state) => state.auth); 
    
    const { 
        doctorStats, 
        doctorWeeklyStats, 
        doctorRecentReviews,
        loading: appointmentLoading, 
        error: appointmentError 
    } = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchDoctorStats());
        dispatch(fetchDoctorWeeklyStats());
        dispatch(fetchDoctorRecentReviews());
    }, [dispatch]);

    const isLoading = authLoading || appointmentLoading || doctorStats === null || doctorWeeklyStats === null;
    
    const displayName = user?.username || user?.email || "Doctor";
    
    const statsData = {
        today: doctorStats?.total_appointments_today || 0,
        pending: doctorStats?.pending_appointments || 0,
        patients: doctorStats?.total_patients || 0,
        completed: doctorStats?.completed_appointments || 0,
        rating: doctorStats?.average_rating?.toFixed(1) || 'N/A',
        reviews: doctorStats?.total_reviews || 0,
    };
    
    if (isLoading) {
        return (
            <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
                <div className="flex items-center justify-center min-h-[400px] text-center text-gray-600">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3"></div>
                    <p className="text-lg font-semibold">Loading Dashboard data...</p>
                </div>
            </DashboardLayout>
        );
    }
    
    if (appointmentError) {
        return (
            <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
                <div className="p-8 text-center text-red-600">
                    <p className="text-lg font-semibold">Error fetching dashboard statistics.</p>
                    <p className="text-sm">{JSON.stringify(appointmentError)}</p>
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
            <div className="max-w-7xl mx-auto">

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
                        Welcome back, Dr. {displayName}! 👨‍⚕
                    </h2>
                    <p className="text-gray-600">Your practice summary and quick actions are below.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-500">
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-green-500" /> Today's Appointments
                        </p>
                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{statsData.today}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-yellow-500">
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                            <ArrowUp className="w-4 h-4 text-yellow-500" /> Pending Requests
                        </p>
                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{statsData.pending}</p>
                    </div>
                 
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-500">
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-500" /> Total Patients
                        </p>
                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{statsData.patients}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-500">
                        <p className="text-sm text-gray-600 font-medium">Completed Appointments</p>
                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{statsData.completed}</p>
                    </div>
                    
 
                    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-orange-500">
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                            <Star className="w-4 h-4 text-orange-500" fill="currentColor" /> Avg. Rating ({statsData.reviews})
                        </p>
                        <p className="text-4xl font-extrabold text-gray-800 mt-2">{statsData.rating}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <WeeklyPatientChart 
                            weeklyStats={doctorWeeklyStats?.weekly_stats || []} 
                            totalWeek={doctorWeeklyStats?.total_week || 0}
                        />
                    </div>
       
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                            Recent Patient Reviews
                        </h3>
                        
                        {doctorRecentReviews && doctorRecentReviews.length > 0 ? (
                            <div className="space-y-4">
                                {doctorRecentReviews.map((review) => (
                                    <div key={review.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        
                                   
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-gray-800">{review.patient_name}</p>
                                            <div className="flex items-center text-xs text-yellow-600">
                                                <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                                                {review.rating}.0
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-gray-700 italic line-clamp-2">
                                            "{review.comment}"
                                        </p>

                                        <span className="text-xs text-gray-500 mt-1 block text-right">
                                            {review.time_ago}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 rounded-xl text-center">
                                <p className="text-gray-500 font-medium">No recent reviews yet. Keep up the great work! ✨</p>
                            </div>
                        )}
                        <button className="w-full mt-4 text-blue-600 text-sm font-semibold hover:underline">View All Reviews</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorDashboard;
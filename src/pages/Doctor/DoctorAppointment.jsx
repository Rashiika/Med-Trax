import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, User, AlertTriangle, MessageSquare, Users, LogOut, Menu, X, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctorRequests, fetchDoctorConfirmedAppointments, acceptAppointmentRequest, rejectAppointmentRequest } from "../../redux/features/appointmentSlice";
import { showToast } from "../../components/Toast"; 
import DashboardLayout from '../../components/Layout/DashboardLayout'; 
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';
import { fetchDoctorPatients } from "../../redux/features/chatSlice";
import { FileText } from "lucide-react";

const doctorSidebarItems = [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: homeIcon },
    { label: 'Appointments', to: '/doctor/appointments', icon: appointmentIcon },
    { label: 'Chats', to: '/doctor/chats', icon: chatsIcon },
    { label: 'Prescriptions', to: '/doctor/prescriptions', icon: <FileText className="w-5 h-5" /> },
    { label: 'Blogs', to: '/doctor/blogs', icon: blogIcon },
    { label: 'Profile', to: '/doctor/profile', icon: profileIcon },
];

const getStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    let colorClass = 'bg-gray-100 text-gray-700 border-gray-300';

    if (lowerStatus === 'confirmed' || lowerStatus === 'upcoming') {
        colorClass = 'bg-green-100 text-green-700 border-green-300';
    } else if (lowerStatus === 'pending') {
        colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else if (lowerStatus === 'rejected' || lowerStatus === 'cancelled') {
        colorClass = 'bg-red-100 text-red-700 border-red-300';
    } else if (lowerStatus === 'completed') {
        colorClass = 'bg-blue-100 text-blue-700 border-blue-300';
    }

    return (
        <span className={`px-6 py-3 rounded-xl font-bold border-2 shadow-sm ${colorClass}`}>
            {status || "Unknown"}
        </span>
    );
};

const AppointmentCard = ({ apt, type, handleAccept, handleReject, actionLoading }) => {
    const isPendingTab = type === 'pending';
    
    const status = apt.status_display || apt.status;
    const isPendingStatus = status?.toLowerCase() === 'pending';

    const borderColor = isPendingStatus ? 'border-yellow-500' : 'border-blue-500';
    const bgColor = isPendingStatus ? 'bg-yellow-50' : 'bg-blue-50';
    const initials = apt.patient_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';

    return (
        <div key={apt.id} className={`bg-white rounded-2xl shadow-lg p-6 border-l-8 ${borderColor} hover:shadow-xl transition-shadow duration-300`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center border border-gray-200`}>
                            <span className="font-bold text-lg text-gray-700">{initials}</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{apt.patient_name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="w-3 h-3"/>
                                {apt.patient_gender || 'N/A'} | Age: {apt.patient_age || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 lg:ml-15">
                        <div className="flex items-center gap-4 text-gray-700">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{apt.appointment_date}</span>
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{apt.appointment_time}</span>
                        </div>

                        <div className={`rounded-xl p-3 mt-3 border border-gray-100 ${bgColor}`}>
                            <p className="text-sm text-gray-600 font-medium mb-1">Reason for Visit:</p>
                            <p className="text-gray-800">{apt.reason}</p>
                        </div>
                    </div>
                </div>

                {isPendingTab ? (
                    <div className="flex lg:flex-col gap-3 lg:w-40">
                        <button
                            onClick={() => handleAccept(apt.id)}
                            disabled={actionLoading === apt.id}
                            className={`flex-1 lg:flex-initial bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                            {actionLoading === apt.id ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<><CheckCircle className="w-5 h-5" /> Accept</>)}
                        </button>
                        <button
                            onClick={() => handleReject(apt.id)}
                            disabled={actionLoading === apt.id}
                            className="flex-1 lg:flex-initial bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {actionLoading === apt.id ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<><XCircle className="w-5 h-5" /> Reject</>)}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center lg:w-40">
                        {getStatusBadge(status)}
                    </div>
                )}
            </div>
        </div>
    );
};


const DoctorAppointment = () => {
    const dispatch = useDispatch();

    const { requests: pendingRequests, doctorAppointments: allAppointments, loading: reduxLoading, error: reduxError } = useSelector((state) => state.appointment);
    
    const [appointmentTab, setAppointmentTab] = useState("pending");
    const [actionLoading, setActionLoading] = useState(null); 

    useEffect(() => {
        dispatch(fetchDoctorRequests()); 
        dispatch(fetchDoctorConfirmedAppointments()); 
    }, [dispatch]);

   const handleAcceptAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
        await dispatch(acceptAppointmentRequest(appointmentId)).unwrap();
        showToast.success("Appointment accepted! Chat enabled with patient.");
        
        // Refresh appointment lists
        dispatch(fetchDoctorRequests());
        dispatch(fetchDoctorConfirmedAppointments());
        
        // ✅ Refresh chat lists
        console.log("🔄 Refreshing doctor's patient chat list...");
        await dispatch(fetchDoctorPatients()).unwrap();
        console.log("✅ Chat list refreshed");
        
    } catch (error) {
        console.error("Error accepting appointment:", error);
        showToast.error(error.message || "Failed to accept appointment");
    } finally {
        setActionLoading(null);
    }
};
    const handleRejectAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to reject this appointment?")) {
        return;
    }

    setActionLoading(appointmentId);
    try {
        await dispatch(rejectAppointmentRequest(appointmentId)).unwrap();
        showToast.success("Appointment rejected successfully!");
        
        // Refresh requests list
        dispatch(fetchDoctorRequests());
    } catch (error) {
        console.error("Error rejecting appointment:", error);
        showToast.error(error.message || "Failed to reject appointment");
    } finally {
        setActionLoading(null);
    }
};

    if (reduxError) {
        return (
            <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
                <div className="text-center p-12 border-l-4 border-red-500 bg-red-50 rounded-xl">
                    <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Appointments</h3>
                    <p className="text-gray-600">Failed to fetch data. Please retry.</p>
                    <button 
                        onClick={() => { dispatch(fetchDoctorRequests()); dispatch(fetchDoctorConfirmedAppointments()); }}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Retry Fetch
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (reduxLoading) {
        return (
            <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="ml-3 text-gray-600">Loading appointments...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Appointments</h2>
                    <p className="text-gray-600 text-lg">Manage your patient appointments and requests</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex">
                    <button
                        onClick={() => setAppointmentTab("pending")}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            appointmentTab === "pending" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg" : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Pending Requests
                        {pendingRequests?.length > 0 && (<span className="ml-2 px-2 py-1 bg-white text-yellow-600 rounded-full text-xs font-bold">{pendingRequests.length}</span>)}
                    </button>
                    <button
                        onClick={() => setAppointmentTab("confirmed")}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            appointmentTab === "confirmed" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        All Appointments
                        {allAppointments?.length > 0 && (<span className="ml-2 px-2 py-1 bg-white text-blue-600 rounded-full text-xs font-bold">{allAppointments.length}</span>)}
                    </button>
                </div>

                {appointmentTab === "pending" && (
                    <div className="space-y-6">
                        {pendingRequests && pendingRequests.length > 0 ? (
                            pendingRequests.map((apt) => (
                                <AppointmentCard 
                                    key={apt.id} 
                                    apt={apt} 
                                    type="pending"
                                    handleAccept={handleAcceptAppointment}
                                    handleReject={handleRejectAppointment}
                                    actionLoading={actionLoading}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-l-4 border-yellow-300">
                                <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pending Requests</h3>
                                <p className="text-gray-600">You have successfully reviewed all current appointment requests.</p>
                            </div>
                        )}
                    </div>
                )}

                {appointmentTab === "confirmed" && (
                    <div className="space-y-6">
                        {allAppointments && allAppointments.length > 0 ? (
                            allAppointments.map((apt) => (
                                <AppointmentCard 
                                    key={apt.id} 
                                    apt={apt} 
                                    type="all" 
                                    handleAccept={handleAcceptAppointment} 
                                    handleReject={handleRejectAppointment}
                                    actionLoading={actionLoading}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-l-4 border-blue-300">
                                <Calendar className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Appointments</h3>
                                <p className="text-gray-600">Check your requests or confirm appointments to see them here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DoctorAppointment;
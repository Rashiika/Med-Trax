import React, { useState, useEffect } from "react";
import { Calendar, User, X } from "lucide-react"; 
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance"; 
import { useNavigate } from "react-router-dom";
import { fetchAvailableDoctors ,bookAppointment} from "../../redux/features/appointmentSlice";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { showToast } from "../../components/Toast"; 
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';


const patientSidebarItems = [
    { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
    { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
    { label: "Chats", to: "/patient/chats", icon: chatsIcon },
    { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
    { label: "Profile", to: "/patient/profile", icon: profileIcon },
];


const PatientAppointment = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const {
        availableDoctors: doctors,
        loading: reduxLoading,
        error: reduxError,
    } = useSelector((state) => state.appointment);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchAvailableDoctors());
    }, [dispatch]);

    const fetchAvailableSlots = async (doctorId, date) => {
        try {
            const response = await axiosInstance.get(
                `/appointments/doctors/${doctorId}/available-slots/?date=${date}`
            );
            setAvailableSlots(response.data.available_slots || []);
        } catch (error) {
            console.error("Error fetching slots:", error);
            setAvailableSlots([]);
        }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedSlot(null);
        if (selectedDoctor && date) {
            fetchAvailableSlots(selectedDoctor.id, date);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedSlot || !reason.trim()) {
            showToast.error("Please fill all fields");
            return;
        }

        setBookingLoading(true);

        const appointmentData = {
            doctor: selectedDoctor.id,
            appointment_date: selectedDate,
            appointment_time: selectedSlot,
            reason: reason.trim()
        };

        try {
            const resultAction = await dispatch(bookAppointment(appointmentData)).unwrap(); 

            console.log("Booking success:", resultAction);
            showToast.success(resultAction.message || "Appointment request sent successfully! The doctor will review your request.");
            setShowBookingModal(false);
            resetBookingForm();
        } catch (error) {
            console.error("Booking error:", error);

            const errorMessage = error.detail 
                || error.message 
                || "Failed to book appointment. Please try again.";

            showToast.error(errorMessage);
        } finally {
            setBookingLoading(false);
        }
    };

    const resetBookingForm = () => {
        setSelectedDoctor(null);
        setSelectedDate("");
        setAvailableSlots([]);
        setSelectedSlot(null);
        setReason("");
    };


    const openBookingModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
    };

    const closeBookingModal = () => {
        setShowBookingModal(false);
        resetBookingForm();
    };

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    if (reduxLoading) {
        return (
             <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
                </div>
            </DashboardLayout>
        );
    }
    
    if (reduxError) {
        const errorMessage =
            typeof reduxError === "string" ? reduxError : reduxError.message;
        return (
            <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
                <div className="p-8 bg-white rounded-xl shadow-xl text-center border-l-4 border-red-500">
                    <h3 className="text-2xl font-bold text-red-700 mb-4">
                        Error Loading Data
                    </h3>
                    <p className="text-gray-600">
                        {errorMessage}
                    </p>
                    <button
                        onClick={() => dispatch(fetchAvailableDoctors())}
                        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }



    return (
        // 4. Wrap the entire component's content in the shared DashboardLayout
        <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
            {/* Main Content (formerly the entire body of the function) */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Book Appointment
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Choose a doctor and schedule your visit
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-2"></div>
                </div>

                {/* Doctors Grid */}
                {doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-t-4 border-teal-500"
                            >
                                {/* Doctor Image */}
                                <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-6 flex justify-center">
                                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <User className="w-16 h-16 text-teal-600" />
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                        Dr. {doctor.full_name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar className="w-4 h-4 text-teal-600" /> {/* Using Calendar as a generic icon placeholder */}
                                        <p className="text-teal-600 font-semibold">
                                            {doctor.specialization || "General Physician"}
                                        </p>
                                    </div>

                                    {doctor.years_of_experience && (
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <Calendar className="w-4 h-4" /> {/* Using Calendar as a generic icon placeholder */}
                                            <span className="text-sm">
                                                {doctor.years_of_experience} years experience
                                            </span>
                                        </div>
                                    )}

                                    {/* Book Button */}
                                    <button
                                        onClick={() => openBookingModal(doctor)}
                                        className="w-full mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Calendar className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            No Doctors Available
                        </h3>
                        <p className="text-gray-600">Please check back later</p>
                    </div>
                )}
            </div>

            {/* Booking Modal (remains outside the main content wrapper, but inside the component) */}
            {showBookingModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white relative">
                            <button
                                onClick={closeBookingModal}
                                className="absolute top-4 right-4 text-white hover:bg-white hover:text-teal-600 rounded-full p-2 transition-all"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
                            <p className="text-teal-100">Dr. {selectedDoctor.full_name}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Doctor Info */}
                            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow">
                                        <User className="w-8 h-8 text-teal-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-lg">
                                            Dr. {selectedDoctor.full_name}
                                        </h3>
                                        <p className="text-teal-600 font-semibold">
                                            {selectedDoctor.specialization}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h4 className="font-semibold text-gray-800 mb-2">
                                    Patient Details
                                </h4>
                                <p className="text-gray-700">
                                    {user?.firstName && user?.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user?.username}
                                </p>
                                {user?.email && (
                                    <p className="text-gray-600 text-sm">{user.email}</p>
                                )}
                            </div>

                            {/* Date Selection */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={getTodayDate()}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
                                />
                            </div>

                            {selectedDate && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Available Time Slots
                                    </label>
                                    {availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {availableSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                                                        selectedSlot === slot
                                                            ? "bg-teal-600 text-white shadow-lg"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
                                            No slots available for this date
                                        </p>
                                    )}
                                </div>
                            )}


                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Reason for Visit
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Describe your symptoms or reason for consultation..."
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all resize-none"
                                />
                            </div>

                            <button
                                onClick={handleBookAppointment}
                                disabled={
                                    bookingLoading ||
                                    !selectedDate ||
                                    !selectedSlot ||
                                    !reason.trim()
                                }
                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {bookingLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5" />
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default PatientAppointment;
import React, { useState, useEffect } from "react";
import {Calendar, MessageSquare,Users,User,LogOut,Menu,X,Clock,Award,MapPin,Star,Video,Phone,} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../api/axiosInstance"; 
import { useNavigate } from "react-router-dom";
import { fetchAvailableDoctors ,bookAppointment} from "../../redux/features/appointmentSlice";

const PatientAppointment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    availableDoctors: doctors,
    loading: reduxLoading,
    error: reduxError,
  } = useSelector((state) => state.appointment);
  const navigate = useNavigate();

  //   const [loading, setLoading] = useState(true);
  //   const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await axiosInstance.get('/appointments/doctors/available/');
  //       console.log("Doctors data:", response.data); // Debug log
  //       setDoctors(response.data);
  //     } catch (error) {
  //       console.error("Error fetching doctors:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

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
    alert("Please fill all fields");
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
    // --- CHANGE IS HERE: Dispatch the Redux Thunk ---
    const resultAction = await dispatch(bookAppointment(appointmentData)).unwrap(); 

    console.log("Booking success:", resultAction);
    alert(resultAction.message || "Appointment request sent successfully! The doctor will review your request.");
    setShowBookingModal(false);
    resetBookingForm();
  } catch (error) {
    // The error here is the rejected value from the thunk
    console.error("Booking error:", error);

    const errorMessage = error.detail 
      || error.message 
      || "Failed to book appointment. Please try again.";

    alert(errorMessage);
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

  const handleTabClick = (tab) => {
    if (tab === "dashboard") {
      navigate("/patient/dashboard");
    } else if (tab === "appointments") {
      navigate("/patient/appointments");
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(false);
    }
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
    if (reduxError) {
      const errorMessage =
        typeof reduxError === "string" ? reduxError : reduxError.message;
      return (
        <div className="flex h-screen items-center justify-center bg-red-50">
          {" "}
          <div className="p-8 bg-white rounded-xl shadow-xl text-center">
            {" "}
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              Error Loading Data
            </h3>
          {" "}
            <p className="text-gray-600">
             {errorMessage}{" "}
            </p>
            {" "}
            <button
              onClick={() => dispatch(fetchAvailableDoctors())}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
               Try Again {" "}
            </button>
          {" "}
          </div>
          {" "}
        </div>
      );
    }
    return (
      <div className="flex h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="flex items-center justify-center flex-1">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-teal-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-teal-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Same as Dashboard */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-gradient-to-b from-teal-700 to-teal-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
        shadow-2xl
      `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-teal-600">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Medtrax</h1>
              <p className="text-teal-200 text-sm">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-white text-teal-700 shadow-lg scale-105"
                : "hover:bg-teal-600 text-white"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => handleTabClick("appointments")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "appointments"
                ? "bg-white text-teal-700 shadow-lg scale-105"
                : "hover:bg-teal-600 text-white"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="font-semibold">Appointments</span>
          </button>

          <button
            onClick={() => handleTabClick("chats")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "chats"
                ? "bg-white text-teal-700 shadow-lg scale-105"
                : "hover:bg-teal-600 text-white"
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="font-semibold">Chats</span>
          </button>

          <button
            onClick={() => handleTabClick("community")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "community"
                ? "bg-white text-teal-700 shadow-lg scale-105"
                : "hover:bg-teal-600 text-white"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="font-semibold">Community</span>
          </button>

          <button
            onClick={() => handleTabClick("profile")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-white text-teal-700 shadow-lg scale-105"
                : "hover:bg-teal-600 text-white"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="font-semibold">Profile</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-teal-600">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg">
            <LogOut className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
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
                      <Award className="w-4 h-4 text-teal-600" />
                      <p className="text-teal-600 font-semibold">
                        {doctor.specialization || "General Physician"}
                      </p>
                    </div>

                    {doctor.years_of_experience && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
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
      </main>

      {/* Booking Modal */}
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
    </div>
  );
};

export default PatientAppointment;

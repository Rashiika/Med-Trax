import React, { useState, useEffect } from "react";
import { Calendar, MessageSquare, Users, User, LogOut, Menu, X, Clock, CheckCircle, XCircle } from "lucide-react";
import { useSelector , useDispatch} from "react-redux";
import { fetchDoctorRequests, fetchDoctorConfirmedAppointments, acceptAppointmentRequest, rejectAppointmentRequest } from "../../redux/features/appointmentSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast"; // ✅ Add toast import



// const testData = {
//     pendingRequests: [
//         {
//             id: 1,
//             patient_name: "John Doe",
//             appointment_date: "2024-11-06",
//             appointment_time: "10:00 AM",
//             reason: "Regular checkup"
//         }
//     ],
//     confirmedAppointments: [
//         {
//             id: 2,
//             patient_name: "Jane Smith", 
//             appointment_date: "2024-11-07",
//             appointment_time: "2:00 PM",
//             reason: "Follow-up consultation"
//         }
//     ]
// };

const DoctorAppointment = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


// const { loading: reduxLoading, error: reduxError } = useSelector((state) => state.appointment);
// const pendingRequests = testData.pendingRequests; // ✅ Use test data
// const confirmedAppointments = testData.confirmedAppointments; // ✅ Use test data
  const { requests: pendingRequests, doctorAppointments: confirmedAppointments, loading: reduxLoading, error: reduxError } = useSelector((state) => state.appointment);
  const [activeTab, setActiveTab] = useState("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointmentTab, setAppointmentTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    console.log("🔄 Fetching doctor appointments and requests...");
    dispatch(fetchDoctorRequests()); 
    dispatch(fetchDoctorConfirmedAppointments());
  }, [dispatch]);

  // ✅ Add debug logs to see what data we're getting
  useEffect(() => {
    console.log("📊 Redux State Debug:", {
      pendingRequests,
      confirmedAppointments,
      loading: reduxLoading,
      error: reduxError
    });
  }, [pendingRequests, confirmedAppointments, reduxLoading, reduxError]);

  const handleAcceptAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
      await dispatch(acceptAppointmentRequest(appointmentId)).unwrap();
      showToast.success("Appointment accepted successfully!"); // ✅ Use toast instead of alert
      
      // ✅ Refetch data after action
      dispatch(fetchDoctorRequests());
      dispatch(fetchDoctorConfirmedAppointments());
    } catch (error) {
      console.error("Error accepting appointment:", error);
      showToast.error(error?.error || "Failed to accept appointment"); // ✅ Use toast
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
      showToast.success("Appointment rejected successfully!"); // ✅ Use toast instead of alert
      
      // ✅ Refetch data after action
      dispatch(fetchDoctorRequests());
      dispatch(fetchDoctorConfirmedAppointments());
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      showToast.error(error?.error || "Failed to reject appointment"); // ✅ Use toast
    } finally {
      setActionLoading(null);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "dashboard") {
      navigate("/doctor/dashboard");
    } else if (tab === "appointments") {
      navigate("/doctor/appointments");
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(false);
    }
  };

  // ✅ Add error display
  if (reduxError) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Appointments</h2>
            <p className="text-gray-600 mb-4">{JSON.stringify(reduxError)}</p>
            <button 
              onClick={() => {
                dispatch(fetchDoctorRequests());
                dispatch(fetchDoctorConfirmedAppointments());
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reduxLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center flex-1">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Rest of your component remains exactly the same... */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-gradient-to-b from-blue-700 to-indigo-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl
      `}>
        <div className="p-6 border-b border-blue-600">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Medtrax</h1>
              <p className="text-blue-200 text-sm">Doctor Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-white text-blue-700 shadow-lg scale-105"
                : "hover:bg-blue-600 text-white"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => handleTabClick("appointments")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "appointments"
                ? "bg-white text-blue-700 shadow-lg scale-105"
                : "hover:bg-blue-600 text-white"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="font-semibold">Appointments</span>
          </button>

          <button
            onClick={() => handleTabClick("chats")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "chats"
                ? "bg-white text-blue-700 shadow-lg scale-105"
                : "hover:bg-blue-600 text-white"
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="font-semibold">Chats</span>
          </button>

          <button
            onClick={() => handleTabClick("community")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "community"
                ? "bg-white text-blue-700 shadow-lg scale-105"
                : "hover:bg-blue-600 text-white"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="font-semibold">Community</span>
          </button>

          <button
            onClick={() => handleTabClick("profile")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-white text-blue-700 shadow-lg scale-105"
                : "hover:bg-blue-600 text-white"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="font-semibold">Profile</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-600">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg">
            <LogOut className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Appointments</h2>
            <p className="text-gray-600 text-lg">Manage your patient appointments</p>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
          </div>

          {/* ✅ Add debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm">
              <strong>Debug Info:</strong> 
              Pending: {pendingRequests?.length || 0}, 
              Confirmed: {confirmedAppointments?.length || 0}, 
              Loading: {reduxLoading.toString()}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex">
            <button
              onClick={() => setAppointmentTab("pending")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                appointmentTab === "pending"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Pending Requests
              {pendingRequests?.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-white text-yellow-600 rounded-full text-xs font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAppointmentTab("confirmed")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                appointmentTab === "confirmed"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Confirmed Appointments
              {confirmedAppointments?.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-white text-blue-600 rounded-full text-xs font-bold">
                  {confirmedAppointments.length}
                </span>
              )}
            </button>
          </div>

          {appointmentTab === "pending" && (
            <div className="space-y-4">
              {pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">{apt.patient_name}</h3>
                            <p className="text-sm text-gray-500">Patient</p>
                          </div>
                        </div>

                        <div className="space-y-2 ml-15">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{apt.appointment_date}</span>
                            <Clock className="w-5 h-5 text-blue-600 ml-4" />
                            <span className="font-semibold">{apt.appointment_time}</span>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 mt-3">
                            <p className="text-sm text-gray-600 font-medium mb-1">Reason for Visit:</p>
                            <p className="text-gray-800">{apt.reason}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-3">
                        <button
                          onClick={() => handleAcceptAppointment(apt.id)}
                          disabled={actionLoading === apt.id}
                          className="flex-1 lg:flex-initial bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {actionLoading === apt.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Accept
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectAppointment(apt.id)}
                          disabled={actionLoading === apt.id}
                          className="flex-1 lg:flex-initial bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {actionLoading === apt.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Calendar className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pending Requests</h3>
                  <p className="text-gray-600">You have no appointment requests at the moment</p>
                </div>
              )}
            </div>
          )}

          {appointmentTab === "confirmed" && (
            <div className="space-y-4">
              {confirmedAppointments && confirmedAppointments.length > 0 ? (
                confirmedAppointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-blue-500 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">{apt.patient_name}</h3>
                            <p className="text-sm text-gray-500">Patient</p>
                          </div>
                        </div>

                        <div className="space-y-2 ml-15">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">{apt.appointment_date}</span>
                            <Clock className="w-5 h-5 text-blue-600 ml-4" />
                            <span className="font-semibold">{apt.appointment_time}</span>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 mt-3">
                            <p className="text-sm text-gray-600 font-medium mb-1">Reason for Visit:</p>
                            <p className="text-gray-800">{apt.reason}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="px-6 py-3 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-xl font-semibold border-2 border-green-300">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Calendar className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Confirmed Appointments</h3>
                  <p className="text-gray-600">You have no confirmed appointments at the moment</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointment;
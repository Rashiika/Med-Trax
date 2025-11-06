import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hydrateAuth } from "./redux/features/authSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailOtp from "./pages/EmailOtp";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import PatientForm from "./pages/Patient/Patient";
import Home from "./pages/Home";
import DoctorForm from "./pages/Doctor/Doctor";
import VerifyPasswordResetOtp from "./pages/VerifyPasswordResetOtp";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import PatientAppointment from "./pages/Patient/PatientAppointment";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import PatientChat from "./pages/Patient/PatientChat";
import DoctorChat from "./pages/Doctor/DoctorChat";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();
  const { isHydrating } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  // Show loading screen while hydrating auth state
  if (isHydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MedTrax...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/emailOtp" element={<EmailOtp />} />
          <Route path="/verifyOtp" element={<VerifyOtp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/verifyPasswordResetOtp" element={<VerifyPasswordResetOtp />} />
          
          {/* --- Profile Completion Routes (Semi-protected) --- */}
          <Route path="/patient" element={<PatientForm />} />
          <Route path="/doctor" element={<DoctorForm />} />
          
          {/* --- Protected Patient Routes --- */}
          <Route 
            path="/patient/dashboard" 
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/appointments" 
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/patient/chat" 
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientChat />
              </ProtectedRoute>
            } 
          />
          
          {/* --- Protected Doctor Routes --- */}
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/chat" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorChat />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
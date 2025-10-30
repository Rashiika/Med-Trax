import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "./redux/features/authSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailOtp from "./pages/EmailOtp";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import PatientForm from "./pages/Patient";
import Home from "./pages/Home";
import DoctorForm from "./pages/Doctor";
import VerifyPasswordResetOtp from "./pages/VerifyPasswordResetOtp";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  const dispatch = useDispatch();

  // Restore auth state from localStorage on app load
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient" element={<PatientForm />} />
        <Route path="/doctor" element={<DoctorForm />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/emailOtp" element={<EmailOtp />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyPasswordResetOtp" element={<VerifyPasswordResetOtp />} />
      </Routes>
    </Router>
  );
}

export default App;
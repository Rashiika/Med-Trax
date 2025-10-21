import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailOtp from "./pages/EmailOtp";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import PatientForm from "./pages/Patient";
import Home from "./pages/Home";
import DoctorForm from "./pages/Doctor";
import VerifyPasswordResetOtp from "./pages/VerifyPasswordResetOtp";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient" element={<PatientForm />} />
        <Route path="/doctor" element={<DoctorForm />} />
        <Route path="/emailOtp" element={<EmailOtp />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyPasswordResetOtp" element={<VerifyPasswordResetOtp />} />
      </Routes>
    </Router>
  );
}

export default App;

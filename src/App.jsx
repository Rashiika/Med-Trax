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
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
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

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              padding: '16px 20px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '500px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
            loading: {
              style: {
                background: '#3B82F6',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#3B82F6',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import EmailOtp from "./pages/EmailOtp";
import VerifyPasswordOtp from "./pages/VerifyPasswordOtp";
import ResetPassword from "./pages/ResetPassword";
import CompleteDoctorProfile from "./pages/CompleteDoctorProfile";
import CompletePatientProfile from "./pages/CompletePatientProfile";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

// Protected Route - requires authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.log("ProtectedRoute: No token found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route - redirects to dashboard if already logged in with completed profile
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user?.profile_completed) {
        console.log("PublicRoute: User logged in and profile complete. Redirecting to dashboard.");
        const dashboardRoute = user.role === "doctor"
          ? "/doctor-dashboard"
          : "/patient-dashboard";
        return <Navigate to={dashboardRoute} replace />;
      }
    } catch (error) {
      console.error("Error parsing user data in PublicRoute:", error);
    }
  }
  return children;
};

// Profile Route - Handles access to profile completion pages
const ProfileRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const signupEmail = sessionStorage.getItem("signup_email");
  const selectedRole = sessionStorage.getItem("selected_role");

  // Allow access if user just came from OTP verification (session items exist)
  const justVerified = signupEmail && selectedRole;

  // If NO token AND they didn't just verify OTP, redirect to login
  if (!token && !justVerified) {
    console.log("ProfileRoute: No token and no signup session. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // If they have a token (logged in normally), check profile completion
  if (token) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // If profile is already complete, redirect to dashboard
      if (user?.profile_completed) {
        console.log("ProfileRoute: Profile already completed. Redirecting to dashboard.");
        const dashboardRoute = user.role === "doctor"
          ? "/doctor-dashboard"
          : "/patient-dashboard";
        return <Navigate to={dashboardRoute} replace />;
      }
    } catch (error) {
      console.error("Error parsing user in ProfileRoute:", error);
    }
  }

  // Allow access if:
  // - They just verified OTP (justVerified is true)
  // - OR They have a token but profile is not complete
  console.log("ProfileRoute: Allowing access to profile completion form. justVerified:", justVerified);
  return children;
};


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes (No Auth Required) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOtp />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/email-otp"
            element={
              <PublicRoute>
                <EmailOtp />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-password-otp"
            element={
              <PublicRoute>
                <VerifyPasswordOtp />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Profile Completion Routes (Requires Auth or Just Verified) */}
          <Route
            path="/complete-doctor-profile"
            element={
              <ProfileRoute>
                <CompleteDoctorProfile />
              </ProfileRoute>
            }
          />

          <Route
            path="/complete-patient-profile"
            element={
              <ProfileRoute>
                <CompletePatientProfile />
              </ProfileRoute>
            }
          />

          {/* Protected Dashboard Routes (Requires Auth and Completed Profile Check by component) */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
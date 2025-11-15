import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requiredRole,
  allowIncompleteProfile = false, // NEW
}) => {
  const { isAuthenticated, isProfileComplete, role, isAuthReady } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Loading state
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If NOT authenticated → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If profile NOT complete BUT route does NOT allow incomplete profile
  if (!isProfileComplete && !allowIncompleteProfile) {
    // Send user to correct onboarding form
    if (role === "patient") return <Navigate to="/patient" replace />;
    if (role === "doctor") return <Navigate to="/doctor" replace />;
  }

  // If profile IS complete BUT route is an onboarding page → redirect to dashboard
  if (isProfileComplete && allowIncompleteProfile) {
    if (role === "patient") return <Navigate to="/patient/dashboard" replace />;
    if (role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
  }

  // Role-specific restriction
  if (requiredRole && role !== requiredRole) {
    const redirectTo =
      role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

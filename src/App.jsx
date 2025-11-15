import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";

// Auth Persistence Wrapper Component
const AuthPersistenceWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthReady } = useSelector((state) => state.auth);

  useEffect(() => {
    // Always check auth on app startup for login persistence
    console.log('🔄 Checking authentication status for login persistence...');
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading while checking authentication
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  return children;
};
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
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogsPage from "./pages/BlogsPage";
import SingleBlogView from "./components/SingleBlogView";
import BlogCreationForm from "./components/BlogCreationForm";
import PatientProfile from "./pages/Patient/PatientProfile";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorChat from "./pages/Doctor/DoctorChat";
import PatientChat from "./pages/Patient/PatientChat";
import DoctorPrescription from "./pages/Doctor/DoctorPrescription";
import PatientPrescription from "./pages/Patient/PatientPrescription";
import Landing from "./pages/Landing";
import { checkAuth } from "./redux/features/authSlice";

function App() {



  return (
    <Router>
      <AuthPersistenceWrapper>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/select-role" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/emailOtp" element={<EmailOtp />} />
          <Route path="/verifyOtp" element={<VerifyOtp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route
            path="/verifyPasswordResetOtp"
            element={<VerifyPasswordResetOtp />}
          />
          <Route
            path="/patient"
            element={
              <ProtectedRoute
                allowIncompleteProfile={true}
                requiredRole="patient"
              >
                <PatientForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute
                allowIncompleteProfile={true}
                requiredRole="doctor"
              >
                <DoctorForm />
              </ProtectedRoute>
            }
          />
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
            path="/patient/blogs"
            element={
              <ProtectedRoute requiredRole="patient">
                <BlogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/blogs/:slug"
            element={
              <ProtectedRoute requiredRole="patient">
                <SingleBlogView />
              </ProtectedRoute>
            }
          />
          {/* <Route 
            path="/patient/contact" 
            element={
              <ProtectedRoute requiredRole="patient">
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Patient Contact</h1>
                    <p className="text-gray-600">Coming Soon</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          /> */}
          {/* <Route 
            path="/patient/lab-result" 
            element={
              <ProtectedRoute requiredRole="patient">
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Lab Results</h1>
                    <p className="text-gray-600">Coming Soon</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/patient/prescription" 
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientPrescription />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/patient/chats"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientChat />
              </ProtectedRoute>
            }
          />

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
            path="/doctor/blogs"
            element={
              <ProtectedRoute requiredRole="doctor">
                <BlogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/blogs/:slug"
            element={
              <ProtectedRoute requiredRole="doctor">
                <SingleBlogView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/blogs/create"
            element={
              <ProtectedRoute requiredRole="doctor">
                <BlogCreationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/chats"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/community"
            element={
              <ProtectedRoute requiredRole="doctor">
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                      Doctor Community
                    </h1>
                    <p className="text-gray-600">Coming Soon</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescription"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorPrescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Current path: {window.location.pathname}
                  </p>
                  <a href="/" className="text-blue-600 hover:underline">
                    Go back to home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
        </AuthPersistenceWrapper>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#363636",
              padding: "16px 20px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "500px",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10B981",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10B981",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#EF4444",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#EF4444",
              },
            },
            loading: {
              style: {
                background: "#3B82F6",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#3B82F6",
              },
            },
          }}
        />
    </Router>
  );
}

export default App;

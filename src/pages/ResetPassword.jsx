import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import logo from "../assets/logo.png";
import doctorImage from "../assets/hospital.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("reset_email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if email is not available
    if (!email) navigate("/email-otp");
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Simple frontend validation for required fields
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Frontend validation for password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Frontend validation for minimum length
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // API call to reset password
      const res = await axiosInstance.post("/reset-password/", { 
        email, 
        new_password: password,
        confirm_password: confirmPassword
      });
      
      if (res.data?.success) {
        setMessage("Password reset successful!");
        sessionStorage.removeItem("reset_email");
        // Redirect to login after a short delay
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      // Handle API errors
      console.error("Reset Password Error:", err);
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side image/branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img src={doctorImage} alt="Doctors" className="object-cover w-full h-full" />
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Med-Trax" className="w-16 h-16 mb-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-1">
              For <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  disabled={loading}
                >
                  {showPassword1 ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  disabled={loading}
                >
                  {showPassword2 ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-6 text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 font-medium"
              disabled={loading}
            >
              Go back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
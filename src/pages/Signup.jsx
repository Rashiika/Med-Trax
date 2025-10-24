import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosConfig";
import logo from "../assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const { selectedRole } = useSelector((state) => state.role);
  console.log("Current selectedRole from Redux:", selectedRole);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if role is not selected
    if (!selectedRole) navigate("/", { replace: true });
  }, [selectedRole, navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      errors.email = "Invalid email format";

    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    else if (formData.password.length > 20)
      errors.password = "Password must be max 20 characters";
    else if (!/[A-Z]/.test(formData.password))
      errors.password = "Must contain uppercase letter";
    else if (!/[a-z]/.test(formData.password))
      errors.password = "Must contain lowercase letter";
    else if (!/[0-9]/.test(formData.password))
      errors.password = "Must contain digit";
    else if (!/[!@#$%^&*(),.?\":{}|<>_\-+=\[\]\\/`~;]/.test(formData.password))
      errors.password = "Must contain special character";
    else if (/\s/.test(formData.password))
      errors.password = "Cannot contain spaces";

    if (!formData.confirm_password)
      errors.confirm_password = "Confirm password required";
    else if (formData.password !== formData.confirm_password)
      errors.confirm_password = "Passwords do not match";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors((p) => ({ ...p, [name]: "" }));
    if (backendError) setBackendError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    setIsLoading(true);
    setBackendError("");

    try {
      const payload = {
        email: formData.email,
        password1: formData.password,
        password2: formData.confirm_password,
        role: selectedRole, // Ensure role is included in payload
      };

      console.log("Sending signup request:", payload);

      const response = await axiosInstance.post("/signup/", payload);

      console.log("Signup response:", response.data);

      if (response.data) {
        // Successful signup, save necessary info before OTP page
        sessionStorage.setItem("signup_email", formData.email);
        sessionStorage.setItem("selected_role", selectedRole); // Re-save just in case

        console.log("Navigating to verify-otp...");
        
        // Navigate to OTP page
        navigate("/verify-otp", {
          state: {
            email: formData.email,
            message: response.data.message || "OTP sent successfully"
          }
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response?.data);
      
      setIsLoading(false);
      
      // Handle different backend error formats
      if (error.response?.data?.error) {
        setBackendError(error.response.data.error);
      } else if (error.response?.data?.errors) {
        setBackendError(Object.values(error.response.data.errors).flat().join(" "));
      } else {
        setBackendError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Sign up as {selectedRole === "doctor" ? "Doctor" : "Patient"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {backendError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-sm text-red-700">{backendError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  validationErrors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword1 ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    validationErrors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Create password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword1 ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
              {!validationErrors.password && (
                <p className="mt-1 text-xs text-gray-500">
                  8-20 chars with uppercase, lowercase, number & special char
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    validationErrors.confirm_password ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Re-enter password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword2 ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {validationErrors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirm_password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Creating Account..." : "Proceed"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Login
              </Link>
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              disabled={isLoading}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
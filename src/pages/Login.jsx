import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../redux/features/authSlice";
import doctorImage from "../assets/hospital.png";
import logo from "../assets/logo.png";
import { selectRole } from "../redux/features/roleSlice";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const { selectedRole } = useSelector((state) => state.role);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [showCompleteProfileButton, setShowCompleteProfileButton] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const profileCompleted = user.profile_completed ?? false;

      if (!profileCompleted) {
        setShowCompleteProfileButton(true);
      } else {
        const dashboardRoute = user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";
        navigate(dashboardRoute, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);


  useEffect(() => {
    dispatch(resetAuthState());
    setShowCompleteProfileButton(false);
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setShowCompleteProfileButton(false);

    try {
      if (!selectedRole) {
        navigate("/", { replace: true });
        return;
      }

      await dispatch(selectRole(selectedRole)).unwrap();
      
      const result = await dispatch(loginUser(formData)).unwrap();
      
      if (result.user && !result.user.profile_completed) {
        setShowCompleteProfileButton(true);
      }
    } catch (err) {
      console.error("Login failed:", err);

      const errorMsg = (err?.message || err?.error || "").toLowerCase();
      const isProfileIncomplete = 
        errorMsg.includes("profile incomplete") ||
        errorMsg.includes("complete your profile");

      if (isProfileIncomplete) {
        setShowCompleteProfileButton(true);
      }
    }
  };

  const handleGoToProfileCompletion = () => {
    const roleToUse = user?.role;
    if (roleToUse === "doctor") {
      navigate("/complete-doctor-profile");
    } else if (roleToUse === "patient") {
      navigate("/complete-patient-profile");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img src={doctorImage} alt="Doctors" className="object-cover w-full h-full" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Med-Trax" className="w-16 h-16 mb-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Secure Login</h1>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-sm text-red-700">
              <p>{error}</p>
            </div>
          )}

          {showCompleteProfileButton && (
            <div className="mb-5">
              <button
                onClick={handleGoToProfileCompletion}
                className="w-full bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 transition font-semibold"
              >
                Complete Profile
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div className="flex justify-end">
              <p
                onClick={() => navigate("/email-otp")}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm space-y-3">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign Up
              </Link>
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Go back to Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
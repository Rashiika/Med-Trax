import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input"; 
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import { loginUser } from "../redux/features/authSlice";
import { showToast } from "../components/Toast";
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const role = useSelector((state) => state.auth.role) || "patient";
  const { isAuthenticated, isAuthReady, role: currentRole } = useSelector(
  (state) => state.auth
);

// Login persistence is now handled by App.jsx AuthPersistenceWrapper
// No need for redirect logic here

  // Don't show loading for login page - let users see the form
  // if (!isAuthReady) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!value) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
      } else if (!value.includes("@")) {
        setErrors((prev) => ({ ...prev, email: "'@' is missing in the email" }));
      } else if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "password") {
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      } else if (value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 8 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (Object.values(errors).some((e) => e)) {
    showToast.error("Please fix errors before submitting.");
    return;
  }

  if (!formData.email || !formData.password) {
    showToast.error("Fill all fields.");
    return;
  }

  if (loading) return; // Prevent double submit
  setLoading(true);
  const loadingToast = showToast.loading("Logging in...");

  try {
    const result = await dispatch(
      loginUser({ credentials: formData, role })
    );

    showToast.dismiss(loadingToast);

    if (loginUser.rejected.match(result)) {
      const err = result.payload;
      showToast.error(err?.message || "Invalid credentials");
      release();
      return;
    }

    showToast.success("Login successful!");

    setTimeout(() => {
      navigate(result.payload.role === "doctor" 
        ? "/doctor/dashboard"
        : "/patient/dashboard");
    }, 800);

  } catch (err) {
    showToast.error("Login failed.");
  } finally {
    setLoading(false);
    release();  // 🔓 allow user to click again
  }
};
  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} 
        className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8">
        <div className="mb-5">
          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => {
              const email = e.target.value.trim();
              setFormData({ ...formData, email: e.target.value });

              if (!email) {
                setErrors((prev) => ({ ...prev, email: "Email is required" }));
              } else if (!email.includes("@")) {
                setErrors((prev) => ({ ...prev, email: "'@' is missing in the email" }));
              } else if (!emailRegex.test(email)) {
                setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
              } else {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            placeholder="Enter your email"
            icon={emailIcon}
            error={errors.email}
          />
        </div>

        <Input
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, password: value });

            if (!value) {
              setErrors((prev) => ({
                ...prev,
                password: "Password is required",
              }));
            } else if (value.length < 8) {
              setErrors((prev) => ({
                ...prev,
                password: "Password must be at least 8 characters",
              }));
            } else {
              setErrors((prev) => ({ ...prev, password: "" }));
            }
          }}
          placeholder="Enter your password"
          icon={lockIcon}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        <div className="text-right mb-6">
          <Link
            to="/EmailOtp"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </FormLayout>
  );
};

export default LoginPage;
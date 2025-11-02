import React, { useState } from "react";
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (Object.values(errors).some((error) => error)) {
      showToast.error("Please fix the errors before submitting.");
      return;
    }
    if (!formData.email || !formData.password) {
      showToast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const loadingToast = showToast.loading("Logging in...");
    
    try {
      const resultAction = await dispatch(loginUser({ 
        credentials: formData, 
        role 
      }));
     
      if (loginUser.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;
        const userRole = payload.user?.role || payload.role;
        
        showToast.dismiss(loadingToast);
        showToast.success("Login successful! Redirecting...");
        
        setTimeout(() => {
          if (userRole === "doctor") {
            navigate("/doctor/dashboard");
          } else {
            navigate("/patient/dashboard");
          }
        }, 1000);
      } else {
        throw resultAction.payload;
      }
      
    } catch (err) {
      showToast.dismiss(loadingToast);
      console.error("Login error:", err);

      if (err?.isIncompleteProfile || err?.is_profile_complete === false) {
        showToast.error(err?.message || "Please complete your profile.");
        
        const userRole = err?.role;
        if (err?.email) {
          localStorage.setItem("signupEmail", err.email);
        }
        
        setTimeout(() => {
          if (userRole === "doctor") {
            navigate("/doctor");
          } else {
            navigate("/patient");
          }
        }, 1500);
      } else {
        const errorMessage = 
          err?.error || 
          err?.errors?.email?.[0] || 
          err?.errors?.password?.[0] ||
          err?.errors?.non_field_errors?.[0] ||
          err?.message ||  
          "Invalid email or password. Please try again.";
        
        showToast.error(errorMessage);
      }
    } finally {
      setLoading(false);
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
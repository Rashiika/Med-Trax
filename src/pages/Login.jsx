import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input"; 
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import eyeOpen from "../assets/eye.png";
import eyeClose from "../assets/eyeclose.png";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/features/authSlice";

const LoginPage = () => {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

 const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }
    alert("Login successful!");
    console.log(formData);

    dispatch(loginUser({ credentials: formData, role: "patient" }));
  };

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Secure Login
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
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8"
        >
          Login
        </button>

        <p className="text-center text-gray-600 text-sm mt-12">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </FormLayout>
  );
};

export default LoginPage;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import hospitalImg from "../assets/hospital.png";
import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import eyeOpen from "../assets/eye.png";
import eyeClose from "../assets/eyeclose.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email format");
      return;
    } else {
      setEmailError("");
    }

    
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      setError("Please fill in all fields");
      return;
    }

   
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    setError("");
    alert("Signup successful!");
  };

  return (
    <div
      className="w-screen h-screen flex overflow-hidden"
      style={{
        background:
          "linear-gradient(57deg, #ACCDF1 0%, #BFDDDE 50%, #D1E9C8 96%)",
      }}
    >
      {/* Left Section */}
      <div className="w-1/2 flex-col items-center justify-center relative space-y-8">
        <div className="flex flex-col items-center absolute top-12 left-170 w-[205px] h-[89.08px]">
          <img src={logo} alt="Med-Trax Logo" className="mb-2 object-contain" />
        </div>

        <div className="flex items-center justify-center mt-60">
          <img
            src={hospitalImg}
            alt="Hospital Illustration"
            className="w-90 h-90 object-contain"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="bg-white w-[466px] h-[720px] max-w-md p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-6 text-black">
            Sign Up
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 w-[394px] h-[439px]">

           
            <div className="relative">
              <img
                src={emailIcon}
                alt="email"
                className="absolute left-3 top-3 w-5 h-5 opacity-70"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (formData.email && !emailRegex.test(formData.email)) {
                    setEmailError("Invalid email format");
                  } else {
                    setEmailError("");
                  }
                }}
                className={`w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  emailError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {emailError}
                </p>
              )}
            </div>

            
            <div className="relative">
              <img
                src={userIcon}
                alt="user"
                className="absolute left-3 top-3 w-5 h-5 opacity-70"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

           
            <div className="relative">
              <img
                src={lockIcon}
                alt="lock"
                className="absolute left-3 top-3 w-5 h-5 opacity-70"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  passwordError ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
                style={{
                  fontFamily: !showPassword ? "password" : "inherit", // shows stars instead of dots
                }}
              />
              <img
                src={showPassword ? eyeOpen : eyeClose}
                alt="toggle"
                className="absolute right-3 top-3 w-5 h-5 cursor-pointer opacity-70"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            
            <div className="relative">
              <img
                src={lockIcon}
                alt="lock"
                className="absolute left-3 top-3 w-5 h-5 opacity-70"
              />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  passwordError ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                }`}
                style={{
                  fontFamily: !showConfirm ? "password" : "inherit",
                }}
              />
              <img
                src={showConfirm ? eyeOpen : eyeClose}
                alt="toggle"
                className="absolute right-3 top-3 w-5 h-5 cursor-pointer opacity-70"
                onClick={() => setShowConfirm(!showConfirm)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {passwordError}
                </p>
              )}
            </div>

            
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Choose role:
              </label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="Doctor"
                    checked={formData.role === "Doctor"}
                    onChange={handleChange}
                  />
                  <span>Doctor</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="Patient"
                    checked={formData.role === "Patient"}
                    onChange={handleChange}
                  />
                  <span>Patient</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1976d2] hover:bg-[#125ea5] text-white font-semibold p-2 rounded-md transition-all duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-600 mt-10 text-sm">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-[#1976d2] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

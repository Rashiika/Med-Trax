import React, { useState } from "react";
import hospitalImg from "../assets/hospital.png";
import eyeOpen from "../assets/eye.png";
import eyeClose from "../assets/eyeclose.png";
import logo from "../assets/logo.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
  const newErrors = {};
  
  const email = formData.email.trim();

   console.log("Email being validated:", email);
  
  if (!email) newErrors.email = "Email is required";
  else if (!emailRegex.test(email)) newErrors.email = "Invalid email address";

  if (!formData.password) newErrors.password = "Password is required";
  else if (formData.password.length < 8)
    newErrors.password = "Password must be at least 8 characters";

  console.log("Errors object:", newErrors);

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Login successful!");
      console.log(formData);
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-white"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Logo */}
      <div className="mb-25">
        <img src={logo} alt="Logo" className="w-45 h-20" />
      </div>

      {/* Main Container */}
      <div className="flex flex-row w-full max-w-6xl h-140 items-center justify-between px-8 gap-x-30">
        {/* Left side - Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src={hospitalImg}
            alt="Hospital Illustration"
            className="w-[80%] h-auto object-contain"
          />
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex justify-center mb-2">
          <form
            onSubmit={handleSubmit}
            className="w-115 h-140 border border-gray-400 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
              Secure Login
            </h2>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
               <img
                  src={emailIcon}
                  alt="email"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
                />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                 onChange={(e) => {
                    // ✅ wrap multiple statements in {}
                    const email = e.target.value.trim();

                    setFormData({ ...formData, email: e.target.value });

                    if (!email) {
                      setErrors(prev => ({ ...prev, email: "Email is required" }));
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      setErrors(prev => ({ ...prev, email: "Invalid email address" }));
                    } else {
                      setErrors(prev => ({ ...prev, email: "" })); // clear error if valid
                    }
                  }}
                className={`w-full border border-gray-400 rounded-md p-3 pl-10 focus:outline-none focus:ring-2 
                   ${errors.email ? 'border-red-500 ring-red-400' : 'border-gray-400 focus:ring-blue-400'}`}
              />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                  <img
                    src={lockIcon}
                    alt="lock"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
                  />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border border-gray-400 rounded-md p-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <img
                src={showPassword ? eyeOpen : eyeClose}
                alt="toggle"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-50"
                onClick={() => setShowPassword(!showPassword)}
              />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8"
            >
              Login
            </button>

            {/* Sign Up */}
            <p className="text-center text-gray-600 text-sm mt-12">
              Don’t have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

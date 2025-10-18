import React, { useState } from "react";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input"; 
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import eyeOpen from "../assets/eye.png";
import eyeClose from "../assets/eyeclose.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    const email = formData.email.trim();

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

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
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Verify Otp
      </h2>

      <form onSubmit={handleSubmit}>
       
        <div className="mb-8">
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(e) => {
            const email = e.target.value.trim();
            setFormData({ ...formData, email: e.target.value });

            if (!email) {
              setErrors((prev) => ({ ...prev, email: "Email is required" }));
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

        {/* Password Input */}
        {/* <Input
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
        /> */}

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <a
            href="/VerifyOtp"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Resend OTP
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8"
        >
          Proceed
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-12">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </form>
    </FormLayout>
  );
};

export default LoginPage;
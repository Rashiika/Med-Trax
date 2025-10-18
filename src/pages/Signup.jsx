import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";

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
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validate form before submit
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Must be at least 8 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.role) newErrors.role = "Select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Signup Successful!");
      console.log("Form data:", formData);
    }
  };

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900">
        Sign Up
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8"
      >
        {/* Email */}
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={emailIcon}
          error={errors.email}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          icon={lockIcon}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={lockIcon}
          showPasswordToggle
          showPassword={showConfirm}
          onTogglePassword={() => setShowConfirm(!showConfirm)}
          error={errors.confirmPassword}
        />

        {/* Role Selection */}
        {/* <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">
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
                className="accent-blue-600"
              />
              <span className="text-gray-800">Doctor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="Patient"
                checked={formData.role === "Patient"}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span className="text-gray-800">Patient</span>
            </label>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div> */}

        {/* Submit Button */}
        <div className="mt-8">
          <Button type="submit" fullWidth>
            Sign Up
          </Button>
        </div>
      </form>

      {/* Login link */}
      <p className="text-center text-gray-600 text-sm mt-8">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </FormLayout>
  );
};

export default Signup;
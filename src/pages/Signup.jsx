import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import { useDispatch } from "react-redux";

const Signup = ({role}) => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  
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
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
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

    if (name === "confirmPassword") {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Confirm Password is required",
        }));
      } else if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    alert("Signup Successful!");
    console.log("Form data:", formData);
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

       
        <div className="mt-8">
          <Button type="submit" fullWidth>
            Proceed
          </Button>
        </div>
      </form>

    
      <p className="text-center text-gray-600 text-sm mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </FormLayout>
  );
};

export default Signup;
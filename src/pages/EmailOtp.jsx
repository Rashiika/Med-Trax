import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import emailIcon from "../assets/email.png";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/features/authSlice";

const EmailOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(forgotPassword({ email: formData.email }));
      console.log("Email submitted:", formData.email);
      navigate("/resetPassword")
    }
  };

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Your Email
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-8">
          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter your email"
            icon={emailIcon}
            error={errors.email}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8"
        >
          Proceed
        </button>

        <p className="text-center text-gray-600 text-sm mt-12">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </FormLayout>
  );
};

export default EmailOtp;

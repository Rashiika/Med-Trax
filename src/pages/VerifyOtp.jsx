import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import { useDispatch } from "react-redux";
import { resendSignupOtp, verifyOtp } from "../redux/features/authSlice";

const VerifyOtp = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({ otp: "" });
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(180); 

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

 
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

 
  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ otp: value });

   
    if (!value) {
      setErrors({ otp: "OTP is required" });
    } else if (value.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
    } else {
      setErrors({ otp: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }
    alert("OTP Verified Successfully!");
    console.log("OTP:", formData.otp);

    dispatch(verifyOtp({otpData: formData}))
  };

  
  const handleResendOtp = async (e) => { 
    e.preventDefault();
    
    if (timer > 0) {
      alert("Please wait for the timer to expire before resending.");
      return;
    }

    if (!email) {
      alert("Cannot resend OTP. Email address is missing. Please go back to Signup.");
      return;
    }
    
    setResending(true);
    try {
      await resendSignupOtp({ email }); 
      
      setTimer(180); 
      alert("A new OTP has been sent!");
      
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to resend OTP. Please try again.";
      alert(errorMessage);
      console.error("Resend error:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Verify OTP
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8">

        <div className="relative">
          <Input
            type="text"
            label="OTP"
            name="otp"
            placeholder="Enter your OTP"
            value={formData.otp}
            onChange={handleChange}
            error={errors.otp}
          />

          <p className="absolute left-0 -bottom-6 text-sm text-black">
        <span className="font-medium ml-1">{formatTime(timer)}</span>min
          </p>
        </div>

          <div className="text-right mb-6">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-blue-600 hover:underline font-medium opacity-70 cursor-pointer"
            >
              Resend OTP
            </button>
          </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8 cursor-pointer"
        >
          Proceed
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

export default VerifyOtp;
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useDispatch } from "react-redux";
import {resendPasswordResetOtp, verifyPasswordResetOtp} from "../redux/features/authSlice";
import { showToast } from "../components/Toast"; 

const VerifyPasswordResetOtp = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); 
  const initialEmail = location.state?.email || ""; 
  const [formData, setFormData] = useState({ email: initialEmail, otp: "" });
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(180);
  const [isResending, setResending] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialEmail) {
      showToast.error("Email is missing. Please start the password reset process again.");
      setTimeout(() => navigate("/emailOtp"), 1500);
    }

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, initialEmail, navigate]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, otp: value }));

    if (!value) {
      setErrors({ otp: "OTP is required" });
    } else if (value.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
    } else {
      setErrors({ otp: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    //const loadingToast = showToast.loading("Verifying OTP..."); 
    
    try {
      await dispatch(verifyPasswordResetOtp(formData)).unwrap();
      
      //showToast.dismiss(loadingToast); 
      showToast.success("OTP Verified Successfully! You can now reset your password."); 
      
      setTimeout(() => {
        navigate("/resetPassword", { state: { email: formData.email } });
      }, 1500);
    } catch (error) {
      console.error("OTP verification failed:", error);

      //showToast.dismiss(loadingToast);

      const errorMessage =
        error?.detail ||
        error?.otp?.[0] ||
        "Verification failed. Please check your OTP.";
      showToast.error(`Verification failed: ${errorMessage}`); 
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (timer > 0) {
      showToast.error("Please wait for the timer to expire before resending."); 
      return;
    }

    if (!formData.email) {
      showToast.error("Cannot resend OTP. Email address is missing. Please go back to email page.");
      return;
    }

    setResending(true);
    const loadingToast = showToast.loading("Resending OTP...");
    
    try {
      await dispatch(
        resendPasswordResetOtp({ email: formData.email })
      ).unwrap();
      setTimer(180);
      
      //showToast.dismiss(loadingToast); 
      showToast.success("A new OTP has been sent!"); 
    } catch (error) {
      showToast.dismiss(loadingToast);

      const errorMessage =
        error?.detail || "Failed to resend OTP. Please try again.";
      showToast.error(errorMessage); 
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
      {initialEmail && (
        <p className="text-center text-gray-600 mb-6">
          A 6-digit code has been sent to **{initialEmail}**
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8"
      >
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
          <p className="absolute left-0 -bottom-6 text-sm text-gray-600">
            Resend available in:{" "}
            <span className="font-medium ml-1 text-black">
              {formatTime(timer)}
            </span>
          </p>
        </div>
        <div className="text-right mb-6">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timer > 0 || isResending}
            className={`text-sm text-blue-600 font-medium ${
              timer > 0 || isResending
                ? "opacity-50 cursor-not-allowed"
                : "hover:underline cursor-pointer"
            }`}
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Verifying..." : "Proceed"}
        </Button>
        <p className="text-center text-gray-600 text-sm mt-12">
          Don't have an account?{" "}
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

export default VerifyPasswordResetOtp;
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button"; // Assuming you need this
import { useDispatch } from "react-redux";
import { resendPasswordResetOtp, verifyPasswordResetOtp } from "../redux/features/authSlice";
// Import THUNKS from the Redux slice file

const VerifyPasswordResetOtp = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const initialEmail = location.state?.email || "copisej192@elygifts.com"; // 🎯 FIX 1: Initialise formData with the email and otp

  const [formData, setFormData] = useState({ email: initialEmail, otp: "" });
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(180); // 🎯 FIX 2: Define the missing state for the resend button
  const [isResending, setResending] = useState(false);
  const [isLoading, setLoading] = useState(false); // Add loading state for verification

  useEffect(() => {
    // If there's no email, redirect to signup/login
    if (!initialEmail) {
      alert("Email is missing. Please sign up again.");
      navigate("/signup");
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
    const { value } = e.target; // 🎯 FIX 3: Preserve the existing formData (which includes email)
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
    // Use async
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    // console.log("Submitting:", formData); // Logs { email: '...', otp: '...' }

    try {
      // 🎯 FIX 4: Dispatch the thunk and use unwrap() to handle the result
      await dispatch(verifyPasswordResetOtp(formData)).unwrap();
      alert("OTP Verified Successfully! Redirecting to patient dashboard...");
      navigate("/resetPassword");
    } catch (error) {
      console.error("OTP verification failed:", error);
      // Display user-friendly error from the backend/thunk
      const errorMessage =
        error?.detail ||
        error?.otp?.[0] ||
        "Verification failed. Please check your OTP.";
      alert(`Verification failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (timer > 0) {
      alert("Please wait for the timer to expire before resending.");
      return;
    }

    if (!formData.email) {
      alert(
        "Cannot resend OTP. Email address is missing. Please go back to Signup."
      );
      return;
    }
    setResending(true);
    try {
      await dispatch(resendPasswordResetOtp({ email: formData.email })).unwrap();
      setTimer(180);
      alert("A new OTP has been sent!");
    } catch (error) {
      const errorMessage =
        error?.detail || "Failed to resend OTP. Please try again.";
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
            // Disable when timer is running OR when resending is in progress
            disabled={timer > 0 || isResending}
            className={`text-sm text-blue-600 font-medium ${
              timer > 0 || isResending
                ? "opacity-50 cursor-not-allowed"
                : "hover:underline cursor-pointer"
            }`}
          >
                          {isResending ? "Sending..." : "Resend OTP"}           {" "}
          </button>
                   {" "}
        </div>
               {" "}
        <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Proceed"}       {" "}
        </Button>
               {" "}
        <p className="text-center text-gray-600 text-sm mt-12">
                    Don’t have an account?          {" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
                        Sign Up          {" "}
          </Link>
                 {" "}
        </p>
             {" "}
      </form>
         {" "}
    </FormLayout>
  );
};
export default VerifyPasswordResetOtp;

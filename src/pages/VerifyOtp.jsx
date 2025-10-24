import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../api/axiosConfig";
import logo from "../assets/logo.png";
import doctorImage from "../assets/hospital.png";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const signupEmail = location.state?.email || sessionStorage.getItem("signup_email");
  // Assuming the component passed in a message on navigation, or fallback to default
  const initialMessage = location.state?.message || "Enter the 6-digit OTP sent to your email";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [resending, setResending] = useState(false);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (timer > 0 && !loading) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    // Cleanup if timer reaches 0 or if component state changes
  }, [timer, loading]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  // --- END TIMER LOGIC ---


  useEffect(() => {
    if (!signupEmail) {
      console.error("Email not found for OTP verification.");
      navigate("/signup", { replace: true });
    }
  }, [signupEmail, navigate]);

  const handleChange = (e) => {
    const value = e.target.value;
    // Keep the robust check: allow only digits and limit length
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      if (error) setError("");
      if (message) setMessage("");
    }
  };

  const handleResendOtp = async (e) => { 
    e.preventDefault();
    
    if (timer > 0 || resending || loading) {
      setError("Please wait for the timer or current process to finish.");
      return;
    }

    if (!signupEmail) {
      setError("Cannot resend OTP. Email address is missing. Please go back to Signup.");
      return;
    }
    
    setResending(true);
    setError("");
    setMessage("Sending new OTP...");

    try {
      // Assuming resend OTP uses the /resend-signup-otp/ path as seen in urls.py
      const response = await axiosInstance.post("/resend-signup-otp/", { email: signupEmail }); 
      
      setTimer(180); // Reset timer on successful resend
      setMessage(response.data?.message || "A new OTP has been sent!");
      
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.response?.data?.detail || err.response?.data?.error || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!signupEmail) {
      setError("Email address not found. Please go back to signup.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/verify-signup-otp/", {
        email: signupEmail,
        otp: otp,
      });

      console.log("API Response:", response); 

      if (response.data?.success || response.status === 200) {
        setMessage("OTP verified successfully! Redirecting...");

        const role = sessionStorage.getItem("selected_role");
        console.log("Role retrieved from sessionStorage:", role); 

        if (role === "doctor") {
          console.log("Navigating to Doctor Profile...");
          navigate("/complete-doctor-profile", { replace: true });
        } else if (role === "patient") {
          console.log("Navigating to Patient Profile...");
          navigate("/complete-patient-profile", { replace: true });
        } else {
          console.error("Role not found or invalid in sessionStorage:", role, "Redirecting to login.");
          setError("Could not determine user role. Please log in.");
          navigate("/login", { replace: true });
        }
      }
      else {
         console.error("API indicated failure:", response.data);
         setError(response.data?.error || "OTP verification failed. Please try again.");
      }

    } catch (err) {
      console.error("OTP verification error:", err); 

      if (err.response) {
          console.error("Error Response Data:", err.response.data);
          console.error("Error Response Status:", err.response.status);
          if (err.response.status === 404) {
              setError("Verification endpoint '/verify-signup-otp/' not found. Please check the API path.");
          } else if (err.response.data?.error) {
              setError(err.response.data.error);
          } else if (err.response.data?.errors) {
              setError(Object.values(err.response.data.errors).flat().join(" "));
          } else {
              setError(`Verification failed with status ${err.response.status}. Please try again.`);
          }
      } else {
          setError("An error occurred while sending the request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img src={doctorImage} alt="Verification" className="object-cover w-full h-full" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Med-Trax" className="w-16 h-16 mb-3" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm mt-2 text-center">
              Enter the 6-digit OTP sent to {signupEmail || "your email"}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-sm text-red-700">
              <p>{error}</p>
            </div>
          )}

          {message && (
             <div className="mb-5 p-3 bg-green-50 border-l-4 border-green-500 rounded-md text-sm text-green-700">
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none tracking-widest text-center"
                disabled={loading}
              />
            </div>

            <div className="flex justify-between items-center text-sm mt-2">
                <p className="text-gray-600">
                    Resend available in: <span className="font-semibold text-blue-600">{formatTime(timer)}</span>
                </p>
                <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`font-medium transition ${
                        timer === 0 && !resending
                            ? "text-blue-600 hover:underline"
                            : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={timer > 0 || resending || loading}
                >
                    {resending ? "Sending..." : "Resend OTP"}
                </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/features/authSlice"; // Assuming this is the correct path

const Signup = () => {
  const dispatch = useDispatch();
  // Ensure 'role' is read correctly from your separate roleSlice
  const role = useSelector((state) => state.role.selectedRole); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // ✅ Keep the role here so it is included in the final payload
    role: role, 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // 💡 Added loading state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- Validation and Change Handlers (Mostly correct, but needs cleanup) ---

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (name, value, currentFormData) => {
    let newErrors = { ...errors };

    // --- Username Validation ---
    if (name === "username") {
      newErrors.username = !value ? "Username is required" : "";
    }

    // --- Email Validation ---
    if (name === "email") {
      if (!value) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        newErrors.email = "";
      }
    }

    // --- Password Validation ---
    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        newErrors.password = "";
      }
      // Re-check confirmPassword when password changes
      if (currentFormData.confirmPassword && currentFormData.confirmPassword !== value) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (currentFormData.confirmPassword) {
        newErrors.confirmPassword = "";
      }
    }

    // --- Confirm Password Validation ---
    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Confirm Password is required";
      } else if (value !== currentFormData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = "";
      }
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Run validation only for the field that changed
    const newErrors = validate(name, value, updatedFormData);
    setErrors(newErrors);
  };

  // --- Submission Handler with Corrections ---
  
  // 💡 Helper function to validate all fields before submit
  const validateAll = () => {
    let allErrors = {};
    Object.keys(formData).forEach(key => {
        // Pass the key, value, and full formData for cross-field checks (like confirmPassword)
        const fieldErrors = validate(key, formData[key], formData);
        if (fieldErrors[key]) {
            allErrors[key] = fieldErrors[key];
        }
    });
    
    // Add check for role selection
    if (!formData.role) {
        allErrors.role = "Please select a role (Doctor/Patient) before signing up.";
    }

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      console.log("Validation failed:", errors);
      return;
    }
    const { confirmPassword, ...baseData } = formData;
    
    const payload = { formData: baseData };
    
    console.log("Dispatching Signup data:", payload.formData);

    setLoading(true);

    try {
        const response = await registerUser(payload);
        
      
        if (response && response.status === 201) { 
             alert("Registration successful! Verifying OTP...");
             navigate("/verifyOtp");
        } else {
             // Handle non-error, but failed responses if the API doesn't throw on logic errors
             alert("Registration failed. Please check the server response.");
             console.error("API returned unsuccessful status:", response);
        }

    } catch (error) {
        // 5. Handle network or API errors (since registerUser throws the error)
        console.error("Registration error:", error);
        // Display specific error message from the backend if available
        const errorMessage = error.response?.data?.email?.[0] || // Django/DRF common format
                             error.response?.data?.username?.[0] ||
                             error.response?.data?.detail ||
                             "Registration failed. Please try again.";
        alert(errorMessage);
    } finally {
        setLoading(false);
    }
  };


  // ... (Rest of the component rendering)

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900">
        Sign Up
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8"
      >
        {/* Role Missing Warning */}
        {!role && (
            <p className="text-red-500 text-sm text-center font-medium mb-4 p-2 border border-red-200 rounded-md bg-red-50">
                Please select your role (Doctor or Patient) before signing up.
            </p>
        )}

        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          icon={userIcon}
          error={errors.username}
        />
        
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
          type={showPassword ? "text" : "password"} // 💡 Use local state for input type
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
          type={showConfirm ? "text" : "password"} // 💡 Use local state for input type
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
          <Button 
            type="submit" 
            fullWidth 
            disabled={loading || Object.values(errors).some(e => e) || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !role}
          >
            {loading ? "Signing Up..." : "Proceed"}
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
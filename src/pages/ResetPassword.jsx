import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import lockIcon from "../assets/lock.png";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  const checkPasswordRules = (password) => ({
    hasUppercase: uppercaseRegex.test(password),
    hasLength: password.length >= 8,
    hasNumber: numberRegex.test(password),
    hasSpecialChar: specialCharRegex.test(password),
  });

  const [passwordRules, setPasswordRules] = useState({
    hasUppercase: false,
    hasLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordRules(checkPasswordRules(value));

      if (!value) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
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

    if (!formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    alert("Password reset successful!");
    console.log(formData);
  };

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Reset Password
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8"
      >
        <Input
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={lockIcon}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
          onFocus={() => setPasswordFocused(true)} 
          onBlur={() => setPasswordFocused(false)}
        />

        {(passwordFocused || formData.password) && (
          <div className="text-sm mt-2 space-y-1">
            <p
              className={`${
                passwordRules.hasUppercase
                  ? "text-green-600"
                  : formData.password
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              • An uppercase character
            </p>
            <p
              className={`${
                passwordRules.hasLength
                  ? "text-green-600"
                  : formData.password
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              • At least 8 characters
            </p>
            <p
              className={`${
                passwordRules.hasNumber
                  ? "text-green-600"
                  : formData.password
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              • At least a number
            </p>
            <p
              className={`${
                passwordRules.hasSpecialChar
                  ? "text-green-600"
                  : formData.password
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              • At least one special symbol
            </p>
          </div>
        )}

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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8"
        >
          Reset Password
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

export default ResetPassword;
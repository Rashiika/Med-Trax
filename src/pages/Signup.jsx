import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/features/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role.selectedRole);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: role,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
      } else if (value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          // password: "Password must be at least 8 characters",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Signup successful!");
    console.log(formData);
  };

  return (
    <FormLayout>
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900">
        Proceed
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-8"
      >
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

        {/* Password Input */}
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          icon={lockIcon}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
          onFocus={() => setPasswordFocused(true)} 
          onBlur={() => setPasswordFocused(false)}
        />

        {/* Password Specification Lines */}
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
          type={showConfirm ? "text" : "password"}
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
            Sign Up
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
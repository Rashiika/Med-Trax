import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/features/authSlice";
import { PasswordRuleLine } from "../components/PasswordRuleLine";
import { showToast } from "../components/Toast";
const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  

  useEffect(() => {
    if (!role) {
      navigate('/select-role', { replace: true });
    }
  }, [role, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkPasswordRules = (password) => ({
    hasLength: password.length >= 8,
    hasUppercase: uppercaseRegex.test(password),
    hasNumber: numberRegex.test(password),
    hasSpecialChar: specialCharRegex.test(password),
  });

  const [passwordRules, setPasswordRules] = useState(
    checkPasswordRules(formData.password1)
  );

  const validateField = (name, value, allFormData) => {
    let error = "";

    if (name === "email") {
      if (!value) error = "Email address is required";
      else if (!emailRegex.test(value)) error = "Invalid email address";
    }

    if (name === "password1") {
      const rules = checkPasswordRules(value);
      setPasswordRules(rules);
      if (!value) error = "Password is required";
    }

    if (name === "password2") {
      if (!value) error = "Please confirm password";
      else if (value !== allFormData.password1)
        error = "Passwords do not match";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const error = validateField(name, value, newFormData);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "password1") {
      const confirmError = validateField(
        "password2",
        newFormData.password2,
        newFormData
      );
      setErrors((prev) => ({ ...prev, password2: confirmError }));
    }
  };

  const isFormValid = useMemo(() => {
    const { email, password1, password2 } = formData;

    if (!email || !password1 || !password2) return false;
    if (password1 !== password2) return false;

    const rulesMet = Object.values(checkPasswordRules(password1)).every(
      (x) => x === true
    );
    const noErrors = Object.values(errors).every((e) => !e);

    return rulesMet && noErrors;
  }, [formData, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      showToast.error("Please select a role from the home page first.");
      return navigate("/select-role");
    }

    if (!isFormValid) {
      showToast.error("Fix errors before submitting.");
      return;
    }

    if (loading) return; 

    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
      };

      await dispatch(registerUser(userData)).unwrap();

      localStorage.setItem("signupEmail", formData.email);

      showToast.success("OTP sent! Check your email.");

      setTimeout(() => {
        navigate("/verifyOtp", {
          state: { email: formData.email, role: role },
        });
      }, 1000);
    } catch (error) {
      showToast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
      release(); 
    }
  };

  return (
    <FormLayout>
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter email"
          icon={emailIcon}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password1"
          placeholder="Enter password"
          icon={lockIcon}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          value={formData.password1}
          onChange={handleChange}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          error={errors.password1}
        />

        {passwordFocused && (
          <div className="text-xs mt-1 p-3 bg-blue-50 rounded-xl border">
            <p className="font-semibold">Password must include:</p>
            <PasswordRuleLine
              isValid={passwordRules.hasLength}
              text="At least 8 characters"
            />
            <PasswordRuleLine
              isValid={passwordRules.hasUppercase}
              text="Uppercase letter"
            />
            <PasswordRuleLine
              isValid={passwordRules.hasNumber}
              text="A number"
            />
            <PasswordRuleLine
              isValid={passwordRules.hasSpecialChar}
              text="Special character"
            />
          </div>
        )}

        <Input
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          name="password2"
          placeholder="Confirm password"
          icon={lockIcon}
          showPasswordToggle
          showPassword={showConfirm}
          onTogglePassword={() => setShowConfirm(!showConfirm)}
          value={formData.password2}
          onChange={handleChange}
          error={errors.password2}
        />

        <Button fullWidth type="submit" disabled={!isFormValid || loading} loading={loading}>
          Sign Up
        </Button>

        <p className="text-center text-gray-600 text-sm mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </FormLayout>
  );
};

export default Signup;

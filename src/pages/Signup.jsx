import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";

const API_BASE_URL = 'http://13.49.67.184';
const SIGNUP_ENDPOINT = '/api/signup/';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role;

    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role, navigate]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setApiError(null);

        if (name === "email") {
            if (!value) setErrors((prev) => ({ ...prev, email: "Email is required" }));
            else if (!emailRegex.test(value)) setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
            else setErrors((prev) => ({ ...prev, email: "" }));
        }
        if (name === "password") {
            if (!value) setErrors((prev) => ({ ...prev, password: "Password is required" }));
            else if (value.length < 8) setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }));
            else setErrors((prev) => ({ ...prev, password: "" }));
        }
        if (name === "confirmPassword") {
            if (!value) setErrors((prev) => ({ ...prev, confirmPassword: "Confirm Password is required" }));
            else if (value !== formData.password) setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
            else setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formIsValid = !Object.values(errors).some(error => error) && formData.email && formData.password && formData.confirmPassword;
        if (!formIsValid) {
            alert("Please fix the errors or fill in all fields.");
            return;
        }

        setIsLoading(true);
        setApiError(null);

        try {
            await axios.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
                email: formData.email,
                password: formData.password,
                role: role,
            });

            navigate("/verifyOtp", { state: { email: formData.email } });

        } catch (error) {
            const errorMessage = error.response?.data?.email?.[0] || error.response?.data?.detail || "Registration failed. Please try again.";
            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormLayout>
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900 capitalize">
                Sign Up as a {role}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} icon={emailIcon} error={errors.email} />
                <Input label="Password" type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} icon={lockIcon} showPasswordToggle showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} error={errors.password} />
                <Input label="Confirm Password" type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} icon={lockIcon} showPasswordToggle showPassword={showConfirm} onTogglePassword={() => setShowConfirm(!showConfirm)} error={errors.confirmPassword} />
                
                {apiError && (<p className="text-red-500 text-sm text-center pt-2">{apiError}</p>)}

                <div className="pt-4">
                    <Button type="submit" fullWidth disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </Button>
                </div>
            </form>
            <p className="text-center text-gray-600 text-sm mt-8">
                Already have an account?{" "}
                <Link to="/login" state={{ role: role }} className="text-blue-600 hover:underline font-medium">
                    Login
                </Link>
            </p>
        </FormLayout>
    );
};

export default Signup;
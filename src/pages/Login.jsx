import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";

const API_BASE_URL = 'http://13.49.67.184';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
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
            else if (!emailRegex.test(value)) setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
            else setErrors((prev) => ({ ...prev, email: "" }));
        }
        if (name === "password") {
            if (!value) setErrors((prev) => ({ ...prev, password: "Password is required" }));
            else if (value.length < 8) setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }));
            else setErrors((prev) => ({ ...prev, password: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (errors.email || errors.password || !formData.email || !formData.password) {
            alert("Please fix the errors or fill in all fields.");
            return;
        }
        
        setIsLoading(true);
        setApiError(null);

        const LOGIN_ENDPOINT = role === "doctor" ? "/api/doctor-login/" : "/api/patient-login/";
        const url = `${API_BASE_URL}${LOGIN_ENDPOINT}`;

        try {
            const response = await axios.post(url, {
                email: formData.email,
                password: formData.password,
            });

            const { token } = response.data;
            if (token) {
                localStorage.setItem("userToken", token);
                localStorage.setItem("userRole", role);
                navigate("/dashboard");
            } else {
                setApiError("Login failed: Invalid response from server.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Invalid email or password.";
            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormLayout>
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 capitalize">
                Login as a {role}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="email" label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" icon={emailIcon} error={errors.email} />
                <Input type="password" label="Password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" icon={lockIcon} showPasswordToggle={true} showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} error={errors.password} />
                {apiError && (<p className="text-red-500 text-sm text-center">{apiError}</p>)}
                <div className="text-right mb-6"><a href="/VerifyOtp" className="text-sm text-blue-600 hover:underline font-medium">Forgot Password?</a></div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200 mt-8 disabled:bg-blue-400">
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <p className="text-center text-gray-600 text-sm mt-8">
                    Don’t have an account?{" "}
                    <Link to="/signup" state={{ role: role }} className="text-blue-600 hover:underline font-medium">Sign Up</Link>
                </p>
                <p className="text-center text-sm mt-4">
                    <Link to="/" className="text-gray-500 hover:underline">Back to role selection</Link>
                </p>
            </form>
        </FormLayout>
    );
};

export default LoginPage;
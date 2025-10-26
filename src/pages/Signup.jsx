import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "../components/Layout/FormLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/features/authSlice";
import { PasswordRuleLine } from "../components/PasswordRuleLine";
import { ToastContainer } from "../components/Toast";

const Signup = () => {

    const dispatch = useDispatch();
  const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password1: "",
        password2: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [toasts, setToasts] = useState([]);

    // --- Toast Logic ---
    const showToast = useCallback((message, type = 'warning') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const closeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);
    // --- End Toast Logic ---

    // --- Validation Rules ---
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

    const [passwordRules, setPasswordRules] = useState(checkPasswordRules(formData.password1));

    const validateField = (name, value, allFormData) => {
        let error = '';

        if (name === 'email') {
            if (!value) {
                error = 'Email address is required';
            } else if (!emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
        } else if (name === 'password1') {
            const rules = checkPasswordRules(value);
            setPasswordRules(rules);

            if (!value) {
                error = 'Password is required';
            } else if (!Object.values(rules).every(rule => rule)) {
                error = 'Password does not meet all security requirements listed below';
            }
        } else if (name === 'password2') {
            if (!value) {
                error = 'Confirmation is required';
            } else if (value !== allFormData.password1) {
                error = 'Passwords do not match';
            }
        }
        return error;
    };

    const validateForm = (data) => {
        let newErrors = {};
        let isValid = true;
        
        ['email', 'password1', 'password2'].forEach(name => {
            const error = validateField(name, data[name], data);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        const error = validateField(name, value, newFormData);
        setErrors(prev => ({ ...prev, [name]: error }));

        if (name === 'password1') {
            setPasswordRules(checkPasswordRules(value));
            if (newFormData.password2 !== undefined) {
                const confirmError = validateField('password2', newFormData.password2, newFormData);
                setErrors(prev => ({ ...prev, password2: confirmError }));
            }
        }
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm(formData)) {
            showToast("Please review the form. Not all required fields are valid.", 'warning');
            return;
        }

        setLoading(true);
        try {
            const userData = await dispatch(registerUser(formData));
            
            console.log('Registration data:', userData);
            
            
            showToast("Success! Your account is created. Check your email for verification.", 'success');
            
         
            navigate('/verifyOtp', { state: { email: formData.email } });

        } catch (error) {
            console.error("Registration failed:", error);
           
            showToast(`Registration Failed: ${error.message || 'An unknown error occurred'}`, 'error');

        } finally {
            setLoading(false);
        }
    };
    
   
    const isFormValid = useMemo(() => {
        const { email, password1, password2 } = formData;
        
        
        if (!email || !password1 || !password2 || password1 !== password2) return false;
        
 
        const rulesMet = Object.values(checkPasswordRules(password1)).every(rule => rule);
        
       
        const hasNoFieldErrors = Object.values(errors).every(err => !err);
        
        return rulesMet && hasNoFieldErrors;
    }, [formData, errors]);


    return (
        <FormLayout>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                Create Your Account
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 w-full max-w-md mx-auto px-4 sm:px-0"
            >
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
                    type={showPassword ? "text" : "password"}
                    name="password1"
                    placeholder="Enter password"
                    value={formData.password1}
                    onChange={handleChange}
                    icon={lockIcon}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    error={errors.password1}
                    onFocus={() => setPasswordFocused(true)} 
                    onBlur={() => setPasswordFocused(false)}
                />

                {passwordFocused && (
                    <div className="text-xs mt-1 space-y-1 p-3 bg-blue-50 rounded-xl border border-blue-200 transition-all duration-300">
                        <p className="font-semibold text-gray-700 mb-1">Password must include:</p>
                        <PasswordRuleLine 
                            isValid={passwordRules.hasLength} 
                            text="At least 8 characters" 
                        />
                        <PasswordRuleLine 
                            isValid={passwordRules.hasUppercase} 
                            text="An uppercase letter (A-Z)" 
                        />
                        <PasswordRuleLine 
                            isValid={passwordRules.hasNumber} 
                            text="A number (0-9)" 
                        />
                        <PasswordRuleLine 
                            isValid={passwordRules.hasSpecialChar} 
                            text="A special symbol (!@#$...)" 
                        />
                    </div>
                )}
                
             
                <Input
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    name="password2"
                    placeholder="Confirm password"
                    value={formData.password2}
                    onChange={handleChange}
                    icon={lockIcon}
                    showPasswordToggle
                    showPassword={showConfirm}
                    onTogglePassword={() => setShowConfirm(!showConfirm)}
                    error={errors.password2}
                />

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        fullWidth 
                        loading={loading}
                        disabled={!isFormValid || loading}
                    >
                        Sign Up
                    </Button>
                </div>
            </form>

            <p className="text-center text-gray-600 text-sm mt-8">
                Already have an account?
                <a href="#login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-blue-600 hover:underline font-medium">
                    Login
                </a>
            </p>
            
            <ToastContainer toasts={toasts} onClose={closeToast} />
        </FormLayout>
    );
};

export default Signup;
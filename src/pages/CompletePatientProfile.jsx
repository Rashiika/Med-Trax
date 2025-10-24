import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAfterProfileCompletion } from "../redux/features/authSlice";
import axiosInstance from "../api/axiosConfig";
import logo from "../assets/logo.png"; // Adjust path if needed

const CompletePatientProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    city: "",
    phone_number: "",
    emergency_contact: "",
    emergency_email: "",
    is_insurance: false,
    ins_company_name: "",
    ins_policy_number: "",
    known_allergies: "",
    chronic_diseases: "",
    previous_surgeries: "",
    family_medical_history: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    "Personal Information",
    "Contact Details",
    "Medical Information",
  ];

  // --- START: CORRECTED useEffect ---
  useEffect(() => {
    // Get indicators that user might have just signed up/verified OTP
    const signupEmail = sessionStorage.getItem("signup_email");
    const selectedRole = sessionStorage.getItem("selected_role");

    // Check Redux auth state (it might be slightly delayed)

    // Redirect to login ONLY IF:
    // 1. Redux state shows not authenticated YET
    // AND
    // 2. There's NO sign they just came from signup/OTP (sessionStorage items are missing)
    if (!isAuthenticated && !signupEmail && !selectedRole) {
      console.log("CompletePatientProfile: Not authenticated AND no signup session info found. Redirecting to login.");
      navigate("/login", { replace: true });
    }
    // Optional logging:
    // else {
    //   console.log("CompletePatientProfile Mount State - isAuthenticated:", isAuthenticated, "signupEmail:", signupEmail, "selectedRole:", selectedRole);
    // }

  }, [isAuthenticated, navigate]); // Re-run if isAuthenticated changes
  // --- END: CORRECTED useEffect ---

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  const validateStep = (step) => {
    const errors = {};
    const phoneRegex = /^\+?\d{10,15}$/; // Allows optional +
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 0) {
      if (!formData.first_name.trim()) errors.first_name = "First name is required";
      if (!formData.last_name.trim()) errors.last_name = "Last name is required";
      if (!formData.date_of_birth) errors.date_of_birth = "Date of birth is required";
      if (!formData.gender) errors.gender = "Gender is required";
      if (!formData.blood_group) errors.blood_group = "Blood group is required";
      if (!formData.city.trim()) errors.city = "City is required";
    } else if (step === 1) {
      if (!formData.phone_number.trim()) errors.phone_number = "Phone number is required";
      else if (!phoneRegex.test(formData.phone_number)) errors.phone_number = "Invalid phone number";

      if (formData.emergency_contact && !phoneRegex.test(formData.emergency_contact)) {
        errors.emergency_contact = "Invalid emergency contact number";
      }

      if (formData.emergency_email && !emailRegex.test(formData.emergency_email)) {
        errors.emergency_email = "Invalid email format";
      }

      if (formData.is_insurance) {
        if (!formData.ins_company_name.trim()) {
          errors.ins_company_name = "Insurance company name is required";
        }
        if (!formData.ins_policy_number.trim()) {
          errors.ins_policy_number = "Insurance policy number is required";
        }
      }
    }
    // No validation needed for step 2 as all fields are optional

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError("");

    try {
      const signupEmail = sessionStorage.getItem("signup_email");
      // Use signupEmail if available (just finished OTP), otherwise use email from Redux store
      const emailToUse = signupEmail || user?.email; 

      if (!emailToUse) {
         throw new Error("User email not found for profile completion.");
      }
      
      const payload = {
        email: emailToUse,
        ...formData,
      };

      const response = await axiosInstance.post("/complete-patient-profile/", payload);

      if (response.data?.success) {
        // Clear session storage items related to signup flow
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("selected_role");

        // Dispatch update to Redux store
        dispatch(updateUserAfterProfileCompletion({
          profile_completed: true,
          username: response.data.username || user?.username // Use response or existing username
        }));
        
        // Navigate to dashboard
        navigate("/patient-dashboard", { replace: true });
      } else {
         setError(response.data?.error || "An unknown error occurred during profile submission.");
      }
    } catch (err) {
      console.error("Profile completion error:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        setValidationErrors(backendErrors);
        setError("Please correct the errors below");
      } else {
        setError(err.message || "Failed to complete profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Rest of the component (return statement with JSX) remains the same ---
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen py-6">
      <div className="flex w-11/12 lg:w-4/5 bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="w-1/4 bg-blue-50 p-6 border-r border-gray-200">
          <div className="flex items-center space-x-2 mb-8">
            <img src={logo} alt="Med-Trax" className="h-8 w-auto" />
            <h2 className="text-lg font-semibold text-blue-700">Med-Trax</h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center space-x-3 ${
                  idx === currentStep
                    ? "text-green-600 font-medium"
                    : idx < currentStep
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    idx === currentStep
                      ? "bg-green-100"
                      : idx < currentStep
                      ? "bg-blue-100"
                      : "bg-gray-200"
                  }`}
                >
                  {idx < currentStep ? <span>✓</span> : <span>{idx + 1}</span>}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-3/4 p-8 overflow-y-scroll h-[90vh]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-semibold text-blue-700">Patient Profile</h1>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Back
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 0 && (
              <Section title="Personal Details">
                <InputGrid>
                  <Input
                    label="First Name" name="first_name" value={formData.first_name} onChange={handleChange}
                    placeholder="Enter your first name" error={validationErrors.first_name}
                  />
                  <Input
                    label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange}
                    placeholder="Enter your last name" error={validationErrors.last_name}
                  />
                  <Input
                    label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange}
                    error={validationErrors.date_of_birth}
                  />
                  <Select
                    label="Gender" name="gender" value={formData.gender} onChange={handleChange}
                    options={[ { value: "M", label: "Male" }, { value: "F", label: "Female" }, { value: "O", label: "Other" } ]}
                    error={validationErrors.gender}
                  />
                  <Select
                    label="Blood Group" name="blood_group" value={formData.blood_group} onChange={handleChange}
                    options={[
                      { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
                      { value: "O+", label: "O+" }, { value: "O-", label: "O-" },
                      { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }
                    ]}
                    error={validationErrors.blood_group}
                  />
                  <Input
                    label="City" name="city" value={formData.city} onChange={handleChange}
                    placeholder="Enter your city" error={validationErrors.city}
                  />
                </InputGrid>
              </Section>
            )}

            {currentStep === 1 && (
              <Section title="Contact & Insurance Details">
                <InputGrid>
                  <Input
                    label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange}
                    placeholder="Enter phone number" error={validationErrors.phone_number}
                  />
                  <Input
                    label="Emergency Contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange}
                    placeholder="Enter emergency contact (optional)" error={validationErrors.emergency_contact}
                  />
                  <Input
                    label="Emergency Email" name="emergency_email" type="email" value={formData.emergency_email} onChange={handleChange}
                    placeholder="Enter emergency email (optional)" error={validationErrors.emergency_email} colSpan={2}
                  />
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox" name="is_insurance" checked={formData.is_insurance} onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">I have medical insurance</span>
                    </label>
                  </div>
                  {formData.is_insurance && (
                    <>
                      <Input
                        label="Insurance Company Name" name="ins_company_name" value={formData.ins_company_name} onChange={handleChange}
                        placeholder="Enter company name" error={validationErrors.ins_company_name}
                      />
                      <Input
                        label="Insurance Policy Number" name="ins_policy_number" value={formData.ins_policy_number} onChange={handleChange}
                        placeholder="Enter policy number" error={validationErrors.ins_policy_number}
                      />
                    </>
                  )}
                </InputGrid>
              </Section>
            )}

            {currentStep === 2 && (
              <Section title="Medical Information">
                <InputGrid>
                  <Textarea
                    label="Known Allergies" name="known_allergies" value={formData.known_allergies} onChange={handleChange}
                    placeholder="List any known allergies (optional)" error={validationErrors.known_allergies}
                  />
                  <Textarea
                    label="Chronic Diseases" name="chronic_diseases" value={formData.chronic_diseases} onChange={handleChange}
                    placeholder="List any chronic diseases (optional)" error={validationErrors.chronic_diseases}
                  />
                  <Textarea
                    label="Previous Surgeries" name="previous_surgeries" value={formData.previous_surgeries} onChange={handleChange}
                    placeholder="List previous surgeries (optional)" error={validationErrors.previous_surgeries}
                  />
                  <Textarea
                    label="Family Medical History" name="family_medical_history" value={formData.family_medical_history} onChange={handleChange}
                    placeholder="Describe family medical history (optional)" error={validationErrors.family_medical_history}
                  />
                </InputGrid>
              </Section>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components (Section, InputGrid, Input, Textarea, Select) remain unchanged ---
const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
      {title}
    </h2>
    {children}
  </div>
);

const InputGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

const Input = ({ label, name, value, onChange, placeholder, type = "text", colSpan, error }) => (
  <div className={`${colSpan ? "md:col-span-2" : ""}`}>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, name, value, onChange, placeholder, error }) => (
  <div className="md:col-span-2">
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="3"
      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

const Select = ({ label, name, value, onChange, options, error }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    >
      <option value="">Select</option>
      {options.map((opt, i) => (
        <option key={opt.value || i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export default CompletePatientProfile;
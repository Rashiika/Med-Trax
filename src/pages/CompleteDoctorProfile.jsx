import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAfterProfileCompletion } from "../redux/features/authSlice";
import axiosInstance from "../api/axiosConfig";
import logo from "../assets/logo.png";

const CompleteDoctorProfile = () => {
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
    marital_status: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    registration_number: "",
    specialization: "",
    qualification: "",
    years_of_experience: "",
    department: "",
    clinic_name: "",
    phone_number: "",
    alternate_phone_number: "",
    alternate_email: "",
    emergency_contact_person: "",
    emergency_contact_number: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    "Personal Information",
    "Residential Details",
    "Professional Details",
    "Contact Details",
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
      console.log("CompleteDoctorProfile: Not authenticated AND no signup session info found. Redirecting to login.");
      navigate("/login", { replace: true });
    }
    // Optional logging:
    // else {
    //   console.log("CompleteDoctorProfile Mount State - isAuthenticated:", isAuthenticated, "signupEmail:", signupEmail, "selectedRole:", selectedRole);
    // }

  }, [isAuthenticated, navigate]); // Re-run if isAuthenticated changes
  // --- END: CORRECTED useEffect ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  const validateStep = (step) => {
    const errors = {};

    const phoneRegex = /^\+?\d{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pincodeRegex = /^\d{6}$/;

    if (step === 0) {
      if (!formData.first_name.trim()) errors.first_name = "First name is required";
      if (!formData.last_name.trim()) errors.last_name = "Last name is required";
      if (!formData.date_of_birth) errors.date_of_birth = "Date of birth is required";
      if (!formData.gender) errors.gender = "Gender is required";
      if (!formData.blood_group) errors.blood_group = "Blood group is required";
      if (!formData.marital_status.trim()) errors.marital_status = "Marital status is required";
    } else if (step === 1) {
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
      else if (!pincodeRegex.test(formData.pincode)) errors.pincode = "Invalid pincode format";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.country.trim()) errors.country = "Country is required";
    } else if (step === 2) {
      if (!formData.registration_number.trim()) errors.registration_number = "Registration number is required";
      if (!formData.specialization.trim()) errors.specialization = "Specialization is required";
      if (!formData.qualification.trim()) errors.qualification = "Qualification is required";
      if (!formData.years_of_experience) errors.years_of_experience = "Years of experience is required";
      else if (formData.years_of_experience < 0) errors.years_of_experience = "Years of experience cannot be negative";
      if (!formData.department.trim()) errors.department = "Department is required";
      if (!formData.clinic_name.trim()) errors.clinic_name = "Clinic name is required";
    } else if (step === 3) {
      if (!formData.phone_number.trim()) errors.phone_number = "Phone number is required";
      else if (!phoneRegex.test(formData.phone_number)) errors.phone_number = "Invalid phone number";

      if (formData.alternate_phone_number && !phoneRegex.test(formData.alternate_phone_number)) {
        errors.alternate_phone_number = "Invalid alternate phone number";
      }

      if (formData.alternate_email && !emailRegex.test(formData.alternate_email)) {
        errors.alternate_email = "Invalid email format";
      }

      if (!formData.emergency_contact_person.trim()) {
        errors.emergency_contact_person = "Emergency contact person is required";
      }

      if (!formData.emergency_contact_number.trim()) {
        errors.emergency_contact_number = "Emergency contact number is required";
      } else if (!phoneRegex.test(formData.emergency_contact_number)) {
        errors.emergency_contact_number = "Invalid emergency contact number";
      }
    }

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
      // Use signupEmail if available (just finished OTP), otherwise use email from Redux store (if user logged in later to complete)
      const emailToUse = signupEmail || user?.email; 
      
      if (!emailToUse) {
         throw new Error("User email not found for profile completion.");
      }

      const payload = {
        email: emailToUse, 
        ...formData,
      };

      const response = await axiosInstance.post("/complete-doctor-profile/", payload);

      if (response.data?.success) {
        // Clear session storage items related to signup flow
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("selected_role");

        // Dispatch update to Redux store
        dispatch(updateUserAfterProfileCompletion({
          profile_completed: true,
          // Assuming backend returns username, adjust if needed
          username: response.data.username || user?.username // Use response or existing username
        }));
        
        // Navigate to dashboard
        navigate("/doctor-dashboard", { replace: true });
      } else {
        // Handle cases where API indicates failure without throwing an error
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
                  {idx < currentStep ? (
                    <span>✓</span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-3/4 p-8 overflow-y-scroll h-[90vh]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-semibold text-blue-700">Doctor Profile</h1>

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
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    error={validationErrors.first_name}
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    error={validationErrors.last_name}
                  />
                  <Input
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    error={validationErrors.date_of_birth}
                  />
                  <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: "M", label: "Male" },
                      { value: "F", label: "Female" },
                      { value: "O", label: "Other" }
                    ]}
                    error={validationErrors.gender}
                  />
                  <Select
                    label="Blood Group"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    options={[
                      { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
                      { value: "O+", label: "O+" }, { value: "O-", label: "O-" },
                      { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }
                    ]}
                    error={validationErrors.blood_group}
                  />
                  <Input
                    label="Marital Status"
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    placeholder="e.g., Single, Married"
                    error={validationErrors.marital_status}
                  />
                </InputGrid>
              </Section>
            )}

            {currentStep === 1 && (
              <Section title="Residential Details">
                <InputGrid>
                  <Input
                    label="Address" name="address" value={formData.address} onChange={handleChange}
                    placeholder="Enter your address" colSpan={2} error={validationErrors.address}
                  />
                  <Input
                    label="City" name="city" value={formData.city} onChange={handleChange}
                    placeholder="Enter city" error={validationErrors.city}
                  />
                  <Input
                    label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange}
                    placeholder="Enter pincode" error={validationErrors.pincode}
                  />
                  <Input
                    label="State" name="state" value={formData.state} onChange={handleChange}
                    placeholder="Enter state" error={validationErrors.state}
                  />
                  <Input
                    label="Country" name="country" value={formData.country} onChange={handleChange}
                    placeholder="Enter country" error={validationErrors.country}
                  />
                </InputGrid>
              </Section>
            )}

            {currentStep === 2 && (
              <Section title="Professional Details">
                <InputGrid>
                  <Input
                    label="Registration Number" name="registration_number" value={formData.registration_number} onChange={handleChange}
                    placeholder="Medical Council Registration Number" error={validationErrors.registration_number}
                  />
                  <Input
                    label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange}
                    placeholder="e.g., Cardiology, Pediatrics" error={validationErrors.specialization}
                  />
                  <Input
                    label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange}
                    placeholder="e.g., MBBS, MD" colSpan={2} error={validationErrors.qualification}
                  />
                  <Input
                    label="Years of Experience" name="years_of_experience" type="number" value={formData.years_of_experience} onChange={handleChange}
                    placeholder="Enter years of experience" error={validationErrors.years_of_experience}
                  />
                  <Input
                    label="Department" name="department" value={formData.department} onChange={handleChange}
                    placeholder="e.g., Emergency, OPD" error={validationErrors.department}
                  />
                  <Input
                    label="Clinic Name" name="clinic_name" value={formData.clinic_name} onChange={handleChange}
                    placeholder="Enter clinic/hospital name" colSpan={2} error={validationErrors.clinic_name}
                  />
                </InputGrid>
              </Section>
            )}

            {currentStep === 3 && (
              <Section title="Contact Details">
                <InputGrid>
                  <Input
                    label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange}
                    placeholder="Enter phone number" error={validationErrors.phone_number}
                  />
                  <Input
                    label="Alternate Phone Number" name="alternate_phone_number" value={formData.alternate_phone_number} onChange={handleChange}
                    placeholder="Enter alternate phone (optional)" error={validationErrors.alternate_phone_number}
                  />
                  <Input
                    label="Alternate Email" name="alternate_email" type="email" value={formData.alternate_email} onChange={handleChange}
                    placeholder="Enter alternate email (optional)" colSpan={2} error={validationErrors.alternate_email}
                  />
                  <Input
                    label="Emergency Contact Person" name="emergency_contact_person" value={formData.emergency_contact_person} onChange={handleChange}
                    placeholder="Enter emergency contact person name" error={validationErrors.emergency_contact_person}
                  />
                  <Input
                    label="Emergency Contact Number" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleChange}
                    placeholder="Enter emergency contact number" error={validationErrors.emergency_contact_number}
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

// --- Helper Components (Section, InputGrid, Input, Select) remain unchanged ---
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

export default CompleteDoctorProfile;
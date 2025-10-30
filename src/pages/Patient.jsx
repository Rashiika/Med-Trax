import React, { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import DetailFormLayout from "../components/Layout/DetailFormLayout";
import DetailsInput from "../components/Input/DetailsInput";
import { useDispatch, useSelector } from "react-redux";
import { completeProfile } from "../redux/features/authSlice";
import { showToast } from "../components/Toast"; 

const Section = forwardRef(({ id, title, children }, ref) => (
  <section ref={ref} id={id} className="mb-16 scroll-mt-20">
    <h3 className="text-2xl font-semibold text-center mb-6">{title}</h3>
    {children}
  </section>
));

const PatientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const userEmail = useSelector((state) => state.auth.user?.email) || localStorage.getItem("signupEmail") || "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    city: "",
    mobile: "",
    email: "",
    emergencyContact: "",
    emergencyEmail: "",
    insuranceStatus: "",
    insuranceCompany: "",
    policyNumber: "",
    allergies: "",
    chronicDiseases: "",
    surgeries: "",
    familyHistory: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/; 

 const handleChange = (e) => {
  const { name, value } = e.target;
  const newFormData = { ...formData, [name]: value };
  setFormData(newFormData);
  
  const error = validateField(name, value);
  const newErrors = { ...errors, [name]: error };

  if (name === "insuranceStatus") {
    if (value === "No") {
      setFormData({
        ...newFormData,
        insuranceStatus: value,
        insuranceCompany: "N/A",
        policyNumber: "N/A"
      });
      newErrors.insuranceCompany = "";
      newErrors.policyNumber = "";
    } else if (value === "Yes") {
      setFormData({
        ...newFormData,
        insuranceStatus: value,
        insuranceCompany: "",
        policyNumber: ""
      });
    }
  }

 if (name === "insuranceCompany" && newFormData.insuranceStatus === "Yes") {
  const companyError = validateField("insuranceCompany", value, newFormData);
  newErrors.insuranceCompany = companyError;
}

if (name === "policyNumber" && newFormData.insuranceStatus === "Yes") {
  const policyError = validateField("policyNumber", value, newFormData);
  newErrors.policyNumber = policyError;
}

  setErrors(newErrors);
};

  const validateField = (name, value, currentFormData = formData) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return `${name === "firstName" ? "First" : "Last"} name is required`;
        break;
      case "dob":
        if (!value) return "Date of birth is required";
        break;
      case "gender":
        if (!value) return "Gender is required";
        break;
      case "bloodGroup":
        if (!value) return "Blood group is required";
        break;
      case "city":
        if (!value) return "City is required";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";
        break;
      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        if (!phoneRegex.test(value)) return "Invalid mobile number (10 digits, starts with 6-9)";
        break;
      case "emergencyContact":
        if (value && !phoneRegex.test(value)) return "Invalid emergency contact number";
        break;
      case "emergencyEmail":
        if (value && !emailRegex.test(value)) return "Invalid emergency email";
        break;
      case "insuranceStatus":
        if (!value) return "Insurance status is required";
        break;
      case "insuranceCompany":
        if (formData.insuranceStatus === "Yes" && !value.trim()) return "Insurance company is required";
        break;
      case "policyNumber":
        if (currentFormData.insuranceStatus === "Yes") {
        if (!value.trim()) return "Policy number is required";
        if (!/^\d+$/.test(value)) return "Policy number must contain only digits";
      }   
        break;
      default:
        return "";
    }
    return "";
  };

  const validateAllFields = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName", "lastName", "dob", "gender", "bloodGroup", 
      "city", "email", "mobile", "insuranceStatus"
    ];

    if (formData.insuranceStatus === "Yes") {
      requiredFields.push("insuranceCompany", "policyNumber");
    }

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (formData.emergencyContact) {
      const error = validateField("emergencyContact", formData.emergencyContact);
      if (error) newErrors.emergencyContact = error;
    }
    if (formData.emergencyEmail) {
      const error = validateField("emergencyEmail", formData.emergencyEmail);
      if (error) newErrors.emergencyEmail = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      showToast.error("Please fill all required fields correctly."); 
      const firstErrorField = Object.keys(errors)[0]; 
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
      return;
    }

    const finalFormData = {
      email: userEmail,
      first_name: formData.firstName,
      last_name: formData.lastName,
      date_of_birth: formData.dob,
      gender: formData.gender,
      blood_group: formData.bloodGroup,
      city: formData.city,
      phone_number: formData.mobile,
      emergency_contact: formData.emergencyContact || "",
      emergency_email: formData.emergencyEmail || "",
      is_insurance: formData.insuranceStatus === "Yes",
      ins_company_name: formData.insuranceCompany || "",
      ins_policy_number: formData.policyNumber || "",
      known_allergies: formData.allergies || "",
      chronic_diseases: formData.chronicDiseases || "",
      previous_surgeries: formData.surgeries || "",
      family_medical_history: formData.familyHistory || "",
    };

    console.log("Patient Data:", finalFormData);
    
    setLoading(true);
    //const loadingToast = showToast.loading("Completing your profile..."); 
    
    try {
      const response = await dispatch(completeProfile({ formData: finalFormData, role: "patient" })).unwrap();
      
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      localStorage.removeItem("signupEmail");
      //showToast.dismiss(loadingToast);
      showToast.success("Profile completed successfully! Redirecting to dashboard...");

      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Profile creation error:", err);
      
      //showToast.dismiss(loadingToast); 
      
      const errorMessage = err?.error || 
                          err?.message || 
                          err?.errors?.phone_number?.[0] ||
                          "Failed to complete profile";
      
      showToast.error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Personal Information", "Contact Details", "Insurance Details", "Medical Details"];

  const sectionFields = {
    "Personal Information": ["firstName", "lastName", "dob", "gender", "bloodGroup", "city"],
    "Contact Details": ["mobile", "email"],
    "Insurance Details": formData.insuranceStatus === "Yes" 
      ? ["insuranceStatus", "insuranceCompany", "policyNumber"] 
      : ["insuranceStatus"],
    "Medical Details": [], 
  };

  return (
    <DetailFormLayout
      title="Patient"
      steps={steps}
      formData={formData}
      sectionFields={sectionFields}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput 
            label="First Name" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            placeholder="Enter your first name" 
            required
            error={errors.firstName}
          />
          <DetailsInput 
            label="Last Name" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            placeholder="Enter your last name" 
            required
            error={errors.lastName}
          />
          <DetailsInput 
            label="Date of Birth" 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleChange} 
            required
            error={errors.dob}
          />
          <DetailsInput 
            label="Gender" 
            type="select" 
            name="gender" 
            options={[
              { label: "Male", value: "M" }, 
              { label: "Female", value: "F" }, 
              { label: "Other", value: "O" },
              { label: "Prefer not to say", value: "N" }
            ]} 
            value={formData.gender} 
            onChange={handleChange} 
            required
            error={errors.gender}
          />
          <DetailsInput 
            label="Blood Group" 
            type="select" 
            name="bloodGroup" 
            options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} 
            value={formData.bloodGroup} 
            onChange={handleChange} 
            required
            error={errors.bloodGroup}
          />
          <DetailsInput 
            label="City" 
            type="select"
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            options={["Mumbai", "Delhi", "Pune"]}
            required
            error={errors.city}
          />
        </div>
      </Section>

      <Section title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput 
            label="Mobile number" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleChange} 
            placeholder="Enter 10-digit mobile number" 
            required
            error={errors.mobile}
          />
          <DetailsInput 
            label="Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter email" 
            required
            error={errors.email}
          />
          <DetailsInput 
            label="Emergency contact number" 
            name="emergencyContact" 
            value={formData.emergencyContact} 
            onChange={handleChange} 
            placeholder="Enter emergency contact"
            error={errors.emergencyContact}
          />
          <DetailsInput 
            label="Emergency Email" 
            type="email" 
            name="emergencyEmail" 
            value={formData.emergencyEmail} 
            onChange={handleChange} 
            placeholder="Enter emergency email"
            error={errors.emergencyEmail}
          />
        </div>
      </Section>

      <Section title="Insurance Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput
            label="Insurance Status"
            name="insuranceStatus"
            type="select"
            value={formData.insuranceStatus}
            onChange={handleChange}
            options={["Yes", "No"]}
            required
            error={errors.insuranceStatus}
          />
          {formData.insuranceStatus === "Yes" && (
            <>
              <DetailsInput 
                label="Insurance Company Name" 
                name="insuranceCompany" 
                value={formData.insuranceCompany} 
                onChange={handleChange} 
                placeholder="Enter company name" 
                required
                error={errors.insuranceCompany}
              />
              <DetailsInput 
                label="Policy / ID Number" 
                name="policyNumber" 
                value={formData.policyNumber} 
                onChange={handleChange} 
                placeholder="Enter policy ID" 
                required
                error={errors.policyNumber}
              />
            </>
          )}
        </div>
      </Section>

      <Section title="Medical Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput 
            label="Known Allergies" 
            name="allergies" 
            value={formData.allergies} 
            onChange={handleChange} 
            placeholder="Enter allergies" 
          />
          <DetailsInput 
            label="Chronic Diseases" 
            name="chronicDiseases" 
            value={formData.chronicDiseases} 
            onChange={handleChange} 
            placeholder="Enter chronic diseases" 
          />
          <DetailsInput 
            label="Previous Surgeries" 
            name="surgeries" 
            value={formData.surgeries} 
            onChange={handleChange} 
            placeholder="Enter previous surgeries" 
          />
          <DetailsInput 
            label="Family Medical History" 
            name="familyHistory" 
            value={formData.familyHistory} 
            onChange={handleChange} 
            placeholder="Enter family medical history" 
          />
        </div>
      </Section>
    </DetailFormLayout>
  );
};

export default PatientForm;
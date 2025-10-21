import React, { useState, forwardRef } from "react";
import DetailFormLayout from "../components/Layout/DetailFormLayout";
import DetailsInput from "../components/Input/DetailsInput";
import { useDispatch } from "react-redux";
import { completeProfile } from "../redux/features/authSlice";

const Section = forwardRef(({ id, title, children }, ref) => (
  <section ref={ref} id={id} className="mb-16 scroll-mt-20">
    <h3 className="text-2xl font-semibold text-center mb-6">{title}</h3>
    {children}
  </section>
));

const PatientForm = () => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    city: "",
    phone_number: "",
    email: "",
    emergency_contact: "",
    emergency_email: "",
    is_insurance: "",
    ins_company_name: "",
    ins_policy_number: "",
    known_allergies: "",
    chronic_diseases: "",
    previous_surgeries: "",
    family_medical_history: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Patient Data:", formData);
    dispatch(completeProfile({formData: formData, role: "patient"}))
  };

  const steps = ["Personal Information", "Contact Details", "Insurance Details", "Medical Details"];

  // Define required fields for each section
  const sectionFields = {
    "Personal Information": ["firstName", "lastName", "dob", "gender", "bloodGroup", "city"],
    "Contact Details": ["mobile", "email"],
    "Insurance Details": ["insuranceStatus"], // Only "insuranceStatus" is required
    "Medical Details": [], // No required fields
  };

  return (
    <DetailFormLayout
      title="Patient"
      steps={steps}
      formData={formData}
      sectionFields={sectionFields}
      onSubmit={handleSubmit}
    >
      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter your first name" required/>
          <DetailsInput label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter your last name" required/>
          <DetailsInput label="Date of Birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required/>
          <DetailsInput label="Gender" type="select" name="gender" options={[{ label: "Male", value: "M" }, { label: "Female", value: "F" }, { label: "Other", value: "O" },{ label: "Prefer not to say", value: "N" }]} value={formData.gender} onChange={handleChange} required/>
          <DetailsInput label="Blood Group" type="select" name="blood_group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={formData.blood_group} onChange={handleChange} required/>
          <DetailsInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" required/>
        </div>
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="Mobile number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Enter mobile number" required/>
          <DetailsInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required/>
          <DetailsInput label="Emergency contact number" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} placeholder="Enter emergency contact" />
          <DetailsInput label="Emergency Email" type="email" name="emergency_email" value={formData.emergency_email} onChange={handleChange} placeholder="Enter emergency email" />
        </div>
      </Section>

      {/* Insurance */}
      <Section title="Insurance Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput
            label="Insurance Status"
            name="is_insurance"
            type="select"
            value={formData.is_insurance}
            onChange={handleChange}
            options={["Yes", "No"]}
            required
          />
          {formData.is_insurance === "Yes" && (
            <>
              <DetailsInput label="Insurance Company Name" name="ins_company_name" value={formData.ins_company_name} onChange={handleChange} placeholder="Enter company name" />
              <DetailsInput label="Policy / ID Number" name="ins_policy_number" value={formData.ins_policy_number} onChange={handleChange} placeholder="Enter policy ID" />
            </>
          )}
        </div>
      </Section>

      {/* Medical */}
      <Section title="Medical Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="Known Allergies" name="known_allergies" value={formData.known_allergies} onChange={handleChange} placeholder="Enter allergies" />
          <DetailsInput label="Chronic Diseases" name="chronic_diseases" value={formData.chronic_diseases} onChange={handleChange} placeholder="Enter chronic diseases" />
          <DetailsInput label="Previous Surgeries" name="previous_surgeries" value={formData.previous_surgeries} onChange={handleChange} placeholder="Enter previous surgeries" />
          <DetailsInput label="Family Medical History" name="family_history" value={formData.family_history} onChange={handleChange} placeholder="Enter family medical history" />
        </div>
      </Section>
    </DetailFormLayout>
  );
};

export default PatientForm;
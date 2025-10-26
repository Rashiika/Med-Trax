import React, { useState, forwardRef } from "react";
import DetailFormLayout from "../components/Layout/DetailFormLayout";
import DetailsInput from "../components/Input/DetailsInput";

const Section = forwardRef(({ title, children }, ref) => (
  <section ref={ref} className="mb-16 scroll-mt-20">
    <h3 className="text-xl font-semibold text-center mb-6">{title}</h3>
    {children}
  </section>
));

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    address: "",
    city: "",
    pin: "",
    state: "",
    country: "",
    regNo: "",
    specialization: "",
    qualification: "",
    experience: "",
    department: "",
    clinic: "",
    mobile: "",
    altMobile: "",
    email: "",
    altEmail: "",
    emergencyPerson: "",
    emergencyContact: "",
  });

  const steps = ["Personal Information", "Residential Details", "Professional Details", "Contact Details"];

  const sectionFields = {
    "Personal Information": ["firstName", "lastName", "dob", "gender", "bloodGroup", "maritalStatus"],
    "Residential Details": ["address", "city", "pin", "state", "country"],
    "Professional Details": ["regNo", "specialization", "qualification", "experience", "department", "clinic"],
    "Contact Details": ["mobile", "email"],
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Doctor Form Data:", formData);
  };

  return (
    <DetailFormLayout
      title="Doctor"
      steps={steps}
      formData={formData}
      sectionFields={sectionFields}
      onSubmit={handleSubmit}
    >
      <Section title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" required />
          <DetailsInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" required />
          <DetailsInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          <DetailsInput label="Gender" type="select" name="gender" options={["Male", "Female", "Other" , "Prefer not to say"]} value={formData.gender} onChange={handleChange} required />
          <DetailsInput label="Blood Group" type="select" name="bloodGroup" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={formData.bloodGroup} onChange={handleChange} required />
          <DetailsInput label="Marital Status" type="select" name="maritalStatus" options={["Married", "Unmarried"]} value={formData.maritalStatus} onChange={handleChange} required />
        </div>
      </Section>

      
      <Section title="Residential Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="Address" className="w-full" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" required />
          <DetailsInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" required />
          <DetailsInput label="Pin code" name="pin" value={formData.pin} onChange={handleChange} placeholder="Enter pin code" required />
          <DetailsInput label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" required />
          <DetailsInput label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Enter country" required />
        </div>
      </Section>

      
      <Section title="Professional Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="Registration Number" name="regNo" value={formData.regNo} onChange={handleChange} placeholder="Enter registration number" required />
          <DetailsInput label="Specialization" type="select" name="specialization" options={["Cardiologist","Radiologist","Neurologist","Orthopedic Surgeon","Dermatologist","Gynecologist","Psychiatrist","Dentist","Urologist","General Physician","Pediatrician"]} value={formData.specialization} onChange={handleChange} required />
          <DetailsInput label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Enter qualifications" required />
          <DetailsInput label="Years of Experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Enter experience" required />
          <DetailsInput label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Enter department" required />
          <DetailsInput label="Clinic Name" name="clinic" value={formData.clinic} onChange={handleChange} placeholder="Enter clinic name" required />
        </div>
      </Section>

      
      <Section title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput label="Mobile number" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" required />
          <DetailsInput label="Alternate Mobile number" name="altMobile" value={formData.altMobile} onChange={handleChange} placeholder="Enter alternate mobile" />
          <DetailsInput label="E-mail" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter e-mail" required />
          <DetailsInput label="Alternate E-mail" type="email" name="altEmail" value={formData.altEmail} onChange={handleChange} placeholder="Enter alternate e-mail" />
          <DetailsInput label="Emergency Contact Person" name="emergencyPerson" value={formData.emergencyPerson} onChange={handleChange} placeholder="Enter name" />
          <DetailsInput label="Emergency Contact Number" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Enter emergency contact" />
        </div>
      </Section>
    </DetailFormLayout>
  );
};

export default DoctorForm;

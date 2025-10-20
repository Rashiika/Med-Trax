// src/pages/PatientForm.jsx
import React, { useState } from "react";
import DetailFormLayout from "../components/Layout/DetailFormLayout";
import DetailsInput from "../components/Input/DetailsInput";

const PatientForm = () => {
  const [activeStep, setActiveStep] = useState(0); // 0 = Personal, 1 = Medical, 2 = Contact

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    mobile: "",
    email: "",
    city: "",
    emergencyMobile: "",
    emergencyEmail: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    } else {
      console.log("Final data:", formData);
    }
  };

  return (
    <DetailFormLayout
      title="Patient"
      steps={["Personal Information", "Medical Details", "Contact Information"]}
      activeStep={activeStep}
      setActiveStep={setActiveStep} // ✅ ADD THIS LINE
    >
      <form onSubmit={handleNext} className="space-y-8">
        {activeStep === 0 && (
          <section>
            <h3 className="text-[2.25rem] text-[#000] mb-[2.25rem] text-center pb-1">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailsInput
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <DetailsInput
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <DetailsInput
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <DetailsInput
                label="Gender"
                type="select"
                name="gender"
                options={["Male", "Female", "Other"]}
                value={formData.gender}
                onChange={handleChange}
              />
              <DetailsInput
                label="Blood Group"
                type="select"
                name="bloodGroup"
                options={[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "O+",
                  "O-",
                  "AB+",
                  "AB-",
                ]}
                value={formData.bloodGroup}
                onChange={handleChange}
              />
              <DetailsInput
                label="City"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </section>
        )}

        {activeStep === 1 && (
          <section>
            <h3 className="text-[2.25rem] text-[#000] mb-[2.25rem] text-center pb-1">
              Medical Details
            </h3>
            <p className="text-center text-gray-500">Coming Soon...</p>
          </section>
        )}

        {activeStep === 2 && (
          <section>
            <h3 className="text-[2.25rem] text-[#000] mb-[2.25rem] text-center pb-1">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailsInput
                label="Mobile Number"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
              <DetailsInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <DetailsInput
                label="Emergency Contact Number"
                name="emergencyMobile"
                placeholder="Enter emergency contact number"
                value={formData.emergencyMobile}
                onChange={handleChange}
              />
              <DetailsInput
                label="Emergency Email"
                type="email"
                name="emergencyEmail"
                placeholder="Enter emergency email"
                value={formData.emergencyEmail}
                onChange={handleChange}
              />
            </div>
          </section>
        )}

        {/* Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {activeStep < 2 ? "Next" : "Submit"}
          </button>
        </div>
      </form>
    </DetailFormLayout>
  );
};

export default PatientForm;

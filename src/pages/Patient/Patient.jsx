import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import DetailFormLayout from "../../components/Layout/DetailFormLayout";
import DetailsInput from "../../components/Input/DetailsInput";
import { useDispatch, useSelector } from "react-redux";
import { completeProfile } from "../../redux/features/authSlice";
import { showToast } from "../../components/Toast";

const Section = forwardRef(({ id, title, children }, ref) => (
  <section ref={ref} id={id} className="mb-16 scroll-mt-20">
    <h3 className="text-2xl font-semibold text-center mb-6">{title}</h3>
    {children}
  </section>
));

const PatientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail =
    useSelector((state) => state.auth.user?.email) ||
    localStorage.getItem("signupEmail") ||
    "";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [medicalDetailsAutoFilled, setMedicalDetailsAutoFilled] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const minDob = new Date(
    new Date().setFullYear(new Date().getFullYear() - 100)
  )
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    city: "",
    mobile: "",
    email: userEmail,
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

  const cities = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan",
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const textOnlyRegex = /^[a-zA-Z0-9\s.,;:()\-]+$/;
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    let newErrors = { ...errors };

    if (name === "dob") {
      const selected = new Date(value);
      const maxD = new Date();
      const minD = new Date();
      minD.setFullYear(minD.getFullYear() - 100);

      if (selected > maxD) newFormData.dob = today;
      else if (selected < minD) newFormData.dob = minDob;
      else newFormData.dob = value;
    }

    const error = validateField(name, newFormData[name], newFormData);
    newErrors[name] = error;

    if (name === "insuranceStatus") {
      if (value === "No") {
        newFormData.insuranceCompany = "N/A";
        newFormData.policyNumber = "N/A";
        newErrors.insuranceCompany = "";
        newErrors.policyNumber = "";
      } else if (value === "Yes") {
        newFormData.insuranceCompany = "";
        newFormData.policyNumber = "";
        newErrors.insuranceCompany = validateField("insuranceCompany", "", newFormData);
        newErrors.policyNumber = validateField("policyNumber", "", newFormData);
      }
    }

    if (["allergies", "chronicDiseases", "surgeries", "familyHistory"].includes(name)) {
      setMedicalDetailsAutoFilled(false);
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  useEffect(() => {
    const required = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "bloodGroup",
      "city",
      "email",
      "mobile",
      "insuranceStatus",
    ];

    if (formData.insuranceStatus === "Yes") {
      required.push("insuranceCompany", "policyNumber");
    }

    const allFilled = required.every(
      (f) => formData[f] && formData[f].toString().trim() !== "" && !errors[f]
    );

    if (
      allFilled &&
      !medicalDetailsAutoFilled &&
      formData.allergies === "" &&
      formData.chronicDiseases === "" &&
      formData.surgeries === "" &&
      formData.familyHistory === ""
    ) {
      setFormData({
        ...formData,
        allergies: "N/A",
        chronicDiseases: "N/A",
        surgeries: "N/A",
        familyHistory: "N/A",
      });
      setMedicalDetailsAutoFilled(true);
    }
  }, [formData, errors, medicalDetailsAutoFilled]);

  const validateField = (name, value, current = formData) => {
    if (emojiRegex.test(value)) return "Emojis are not allowed";

    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (!nameRegex.test(value)) return "Only letters and spaces allowed";
        break;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (!nameRegex.test(value)) return "Only letters and spaces allowed";
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
        if (!emailRegex.test(value)) return "Invalid email";
        break;
      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        if (!phoneRegex.test(value)) return "Invalid mobile number";
        break;
      case "emergencyContact":
        if (value && !phoneRegex.test(value)) return "Invalid number";
        break;
      case "emergencyEmail":
        if (value && !emailRegex.test(value)) return "Invalid email";
        break;
      case "insuranceStatus":
        if (!value) return "Insurance status is required";
        break;
      case "insuranceCompany":
        if (current.insuranceStatus === "Yes" && !value.trim())
          return "Company name required";
        break;
      case "policyNumber":
        if (current.insuranceStatus === "Yes") {
          if (!value.trim()) return "Policy number required";
          if (!/^\d+$/.test(value)) return "Only digits allowed";
        }
        break;
      case "allergies":
      case "chronicDiseases":
      case "surgeries":
      case "familyHistory":
        if (value && !textOnlyRegex.test(value)) return "Invalid characters";
        break;
      default:
        break;
    }
    return "";
  };

  const validateAllFields = () => {
    const required = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "bloodGroup",
      "city",
      "email",
      "mobile",
      "insuranceStatus",
    ];
    if (formData.insuranceStatus === "Yes") {
      required.push("insuranceCompany", "policyNumber");
    }

    const newErrors = {};
    required.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });

    if (formData.emergencyContact) {
      const e = validateField("emergencyContact", formData.emergencyContact);
      if (e) newErrors.emergencyContact = e;
    }
    if (formData.emergencyEmail) {
      const e = validateField("emergencyEmail", formData.emergencyEmail);
      if (e) newErrors.emergencyEmail = e;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      showToast.error("Please fill all required fields correctly.");
      return;
    }

    const updated = {
      ...formData,
      lastName: formData.lastName || "",
      allergies: formData.allergies || "N/A",
      chronicDiseases: formData.chronicDiseases || "N/A",
      surgeries: formData.surgeries || "N/A",
      familyHistory: formData.familyHistory || "N/A",
    };

    const finalData = {
      email: userEmail,
      first_name: updated.firstName,
      last_name: updated.lastName,
      date_of_birth: updated.dob,
      gender: updated.gender,
      blood_group: updated.bloodGroup,
      city: updated.city,
      phone_number: updated.mobile,
      emergency_contact: updated.emergencyContact || "",
      emergency_email: updated.emergencyEmail || "",
      is_insurance: updated.insuranceStatus === "Yes",
      ins_company_name: updated.insuranceCompany || "",
      ins_policy_number: updated.policyNumber || "",
      known_allergies: updated.allergies,
      chronic_diseases: updated.chronicDiseases,
      previous_surgeries: updated.surgeries,
      family_medical_history: updated.familyHistory,
    };

    setLoading(true);

    try {
      const response = await dispatch(
        completeProfile({ formData: finalData, role: "patient" })
      ).unwrap();

      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      localStorage.removeItem("signupEmail");

      showToast.success("Profile completed!");

      setTimeout(() => navigate("/patient/dashboard"), 2000);
    } catch (err) {
      showToast.error("Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Personal Information",
    "Contact Details",
    "Insurance Details",
    "Medical Details",
  ];

  const sectionFields = {
    "Personal Information": ["firstName", "lastName", "dob", "gender", "bloodGroup", "city"],
    "Contact Details": ["mobile", "email"],
    "Insurance Details":
      formData.insuranceStatus === "Yes"
        ? ["insuranceStatus", "insuranceCompany", "policyNumber"]
        : ["insuranceStatus"],
    "Medical Details": ["allergies", "chronicDiseases", "surgeries", "familyHistory"],
  };

  return (
    <DetailFormLayout
      title="Patient"
      steps={steps}
      formData={formData}
      sectionFields={sectionFields}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
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
            min={minDob}
            max={today}
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
              { label: "Prefer not to say", value: "N" },
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
            options={cities}
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
            disabled
            placeholder="Email"
            error={errors.email}
          />
          <DetailsInput
            label="Emergency contact number"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Enter emergency number"
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
          {formData.insuranceStatus === "Yes" &&
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
          }
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
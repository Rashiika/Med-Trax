import React, { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import DetailFormLayout from "../components/Layout/DetailFormLayout";
import DetailsInput from "../components/Input/DetailsInput";
import { useDispatch , useSelector} from "react-redux";
import { completeProfile } from "../redux/features/authSlice";

const Section = forwardRef(({ title, children }, ref) => (
  <section ref={ref} className="mb-16 scroll-mt-20">
    <h3 className="text-xl font-semibold text-center mb-6">{title}</h3>
    {children}
  </section>
));

const DoctorForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.user?.email) || "";
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const pinRegex = /^\d{6}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateField = (name, value) => {
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
      case "maritalStatus":
        if (!value) return "Marital status is required";
        break;
      case "address":
        if (!value.trim()) return "Address is required";
        break;
      case "city":
        if (!value) return "City is required";
        break;
      case "pin":
        if (!value.trim()) return "Pin code is required";
        if (!pinRegex.test(value)) return "Pin code must be 6 digits";
        break;
      case "state":
        if (!value.trim()) return "State is required";
        break;
      case "country":
        if (!value.trim()) return "Country is required";
        break;
      case "regNo":
        if (!value.trim()) return "Registration number is required";
        break;
      case "specialization":
        if (!value) return "Specialization is required";
        break;
      case "qualification":
        if (!value.trim()) return "Qualification is required";
        break;
      case "experience":
        if (!value.trim()) return "Years of experience is required";
        if (isNaN(value) || Number(value) < 0) return "Experience must be a valid number";
        break;
      case "department":
        if (!value.trim()) return "Department is required";
        break;
      case "clinic":
        if (!value.trim()) return "Clinic name is required";
        break;
      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        if (!phoneRegex.test(value)) return "Invalid mobile number (10 digits, starts with 6-9)";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";
        break;
      case "altMobile":
        if (value && !phoneRegex.test(value)) return "Invalid alternate mobile number";
        break;
      case "altEmail":
        if (value && !emailRegex.test(value)) return "Invalid alternate email";
        break;
      case "emergencyContact":
        if (value && !phoneRegex.test(value)) return "Invalid emergency contact number";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateAllFields = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName", "lastName", "dob", "gender", "bloodGroup", "maritalStatus",
      "address", "city", "pin", "state", "country",
      "regNo", "specialization", "qualification", "experience", "department", "clinic",
      "mobile", "email"
    ];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (formData.altMobile) {
      const error = validateField("altMobile", formData.altMobile);
      if (error) newErrors.altMobile = error;
    }
    if (formData.altEmail) {
      const error = validateField("altEmail", formData.altEmail);
      if (error) newErrors.altEmail = error;
    }
    if (formData.emergencyContact) {
      const error = validateField("emergencyContact", formData.emergencyContact);
      if (error) newErrors.emergencyContact = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateAllFields()) {
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
    marital_status: formData.maritalStatus,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pin,
    country: formData.country,
    registration_number: formData.regNo,
    specialization: formData.specialization,
    qualification: formData.qualification,
    years_of_experience: Number(formData.experience),
    department: formData.department,
    clinic_name: formData.clinic,
    phone_number: formData.mobile,
    alternate_phone_number: formData.altMobile || "",
    alternate_email: formData.altEmail || "",
    emergency_contact_person: formData.emergencyPerson || "",
    emergency_contact_number: formData.emergencyContact || "",
  };

  console.log("Doctor Form Data:", finalFormData);
  
  setLoading(true);
  try {
    await dispatch(completeProfile({ formData: finalFormData, role: "doctor" })).unwrap();
    navigate("/doctor/dashboard");
  } catch (err) {
    alert(err?.message || "Failed to complete profile");
  } finally {
    setLoading(false);
  }
};
  const steps = ["Personal Information", "Residential Details", "Professional Details", "Contact Details"];

  const sectionFields = {
    "Personal Information": ["firstName", "lastName", "dob", "gender", "bloodGroup", "maritalStatus"],
    "Residential Details": ["address", "city", "pin", "state", "country"],
    "Professional Details": ["regNo", "specialization", "qualification", "experience", "department", "clinic"],
    "Contact Details": ["mobile", "email"],
  };

  return (
    <DetailFormLayout
      title="Doctor"
      steps={steps}
      formData={formData}
      sectionFields={sectionFields}
      onSubmit={handleSubmit}
      loading={loading}
    >
      <Section title="Personal Details">
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
              { label: "Prefer not to say", value: "PNTS" }
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
            label="Marital Status" 
            type="select" 
            name="maritalStatus" 
            options={["Married", "Unmarried"]} 
            value={formData.maritalStatus} 
            onChange={handleChange} 
            required 
            error={errors.maritalStatus}
          />
        </div>
      </Section>

      <Section title="Residential Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput 
            label="Address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="Enter your address" 
            required 
            error={errors.address}
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
          <DetailsInput 
            label="Pin code" 
            name="pin" 
            value={formData.pin} 
            onChange={handleChange} 
            placeholder="Enter 6-digit pin code" 
            required 
            error={errors.pin}
          />
          <DetailsInput 
            label="State" 
            name="state" 
            value={formData.state} 
            onChange={handleChange} 
            placeholder="Enter state" 
            required 
            error={errors.state}
          />
          <DetailsInput 
            label="Country" 
            name="country" 
            value={formData.country} 
            onChange={handleChange} 
            placeholder="Enter country" 
            required 
            error={errors.country}
          />
        </div>
      </Section>

      <Section title="Professional Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsInput 
            label="Registration Number" 
            name="regNo" 
            value={formData.regNo} 
            onChange={handleChange} 
            placeholder="Enter registration number" 
            required 
            error={errors.regNo}
          />
          <DetailsInput 
            label="Specialization" 
            type="select" 
            name="specialization" 
            options={["Cardiologist","Radiologist","Neurologist","Orthopedic Surgeon","Dermatologist","Gynecologist","Psychiatrist","Dentist","Urologist","General Physician","Pediatrician"]} 
            value={formData.specialization} 
            onChange={handleChange} 
            required 
            error={errors.specialization}
          />
          <DetailsInput 
            label="Qualification" 
            name="qualification" 
            value={formData.qualification} 
            onChange={handleChange} 
            placeholder="Enter qualifications" 
            required 
            error={errors.qualification}
          />
          <DetailsInput 
            label="Years of Experience" 
            name="experience" 
            value={formData.experience} 
            onChange={handleChange} 
            placeholder="Enter experience in years" 
            required 
            error={errors.experience}
          />
          <DetailsInput 
            label="Department" 
            name="department" 
            value={formData.department} 
            onChange={handleChange} 
            placeholder="Enter department" 
            required 
            error={errors.department}
          />
          <DetailsInput 
            label="Clinic Name" 
            name="clinic" 
            value={formData.clinic} 
            onChange={handleChange} 
            placeholder="Enter clinic name" 
            required 
            error={errors.clinic}
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
            label="Alternate Mobile number" 
            name="altMobile" 
            value={formData.altMobile} 
            onChange={handleChange} 
            placeholder="Enter alternate mobile" 
            error={errors.altMobile}
          />
          <DetailsInput 
            label="E-mail" 
            type="email" 
            name="email" 
            value={userEmail} 
            onChange={() => {}}
            placeholder="Enter e-mail" 
            required 
            error={errors.email}
            disabled={true}
          />
          <DetailsInput 
            label="Alternate E-mail" 
            type="email" 
            name="altEmail" 
            value={formData.altEmail} 
            onChange={handleChange} 
            placeholder="Enter alternate e-mail" 
            error={errors.altEmail}
          />
          <DetailsInput 
            label="Emergency Contact Person" 
            name="emergencyPerson" 
            value={formData.emergencyPerson} 
            onChange={handleChange} 
            placeholder="Enter name" 
          />
          <DetailsInput 
            label="Emergency Contact Number" 
            name="emergencyContact" 
            value={formData.emergencyContact} 
            onChange={handleChange} 
            placeholder="Enter emergency contact" 
            error={errors.emergencyContact}
          />
        </div>
      </Section>
    </DetailFormLayout>
  );
};

export default DoctorForm;
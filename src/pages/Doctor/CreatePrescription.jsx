import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchDoctorPatients,
  createPrescription,
  clearCreatedPrescription,
} from "../../redux/features/prescriptionSlice";
import { showToast } from "../../components/Toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  User,
  Pill,
  Activity,
} from "lucide-react";
import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";

const doctorSidebarItems = [
  { label: "Dashboard", to: "/doctor/dashboard", icon: homeIcon },
  { label: "Appointments", to: "/doctor/appointments", icon: appointmentIcon },
  { label: "Chats", to: "/doctor/chats", icon: chatsIcon },
  {
    label: "Prescriptions",
    to: "/doctor/prescriptions",
    icon: <FileText className="w-5 h-5" />,
  },
  { label: "Blogs", to: "/doctor/blogs", icon: blogIcon },
  { label: "Profile", to: "/doctor/profile", icon: profileIcon },
];

const CreatePrescription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedPatient = location.state?.patient;

  const { doctorPatients, createLoading, createError } = useSelector(
    (state) => state.prescription
  );

  const [formData, setFormData] = useState({
    patient: preSelectedPatient?.id || "",
    chief_complaint: "",
    diagnosis: "",
    blood_pressure: "",
    temperature: "",
    pulse_rate: "",
    weight: "",
    additional_notes: "",
    follow_up_date: "",
  });

  const [medications, setMedications] = useState([
    {
      medicine_name: "",
      dosage: "",
      frequency: "twice_daily",
      duration: "",
      duration_unit: "days",
      instructions: "",
    },
  ]);

  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    if (!preSelectedPatient) {
      dispatch(fetchDoctorPatients());
    }
  }, [dispatch, preSelectedPatient]);

  useEffect(() => {
    if (createError) {
      showToast.error(
        typeof createError === "string"
          ? createError
          : createError.message || "Failed to create prescription"
      );
      dispatch(clearCreatedPrescription());
    }
  }, [createError, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        medicine_name: "",
        dosage: "",
        frequency: "twice_daily",
        duration: "",
        duration_unit: "days",
        instructions: "",
      },
    ]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addLabTest = () => {
    setLabTests([...labTests, { test_name: "", instructions: "" }]);
  };

  const removeLabTest = (index) => {
    setLabTests(labTests.filter((_, i) => i !== index));
  };

  const handleLabTestChange = (index, field, value) => {
    const updated = [...labTests];
    updated[index][field] = value;
    setLabTests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient || !formData.chief_complaint || !formData.diagnosis) {
      showToast.error("Please fill all required fields");
      return;
    }

    if (medications.some((m) => !m.medicine_name || !m.dosage || !m.duration)) {
      showToast.error("Please complete all medication details");
      return;
    }

    const prescriptionData = {
      ...formData,
      patient: parseInt(formData.patient),
      appointment: formData.appointment ? parseInt(formData.appointment) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      pulse_rate: formData.pulse_rate ? parseInt(formData.pulse_rate) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      medications: medications.map((m) => ({
        ...m,
        duration: parseInt(m.duration),
      })),
      lab_tests: labTests.filter((t) => t.test_name),
    };

    try {
      await dispatch(createPrescription(prescriptionData)).unwrap();
      showToast.success("Prescription created successfully!");
      navigate("/doctor/prescriptions");
    } catch (error) {
      console.error("Error creating prescription:", error);
    }
  };

  const selectedPatientData =
    preSelectedPatient ||
    doctorPatients.find((p) => p.id === parseInt(formData.patient));

  return (
    <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/doctor/prescriptions")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Prescriptions
          </button>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            New Prescription
          </h2>
          <p className="text-gray-600 text-lg">
            Fill in the details to create a prescription
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-2"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              Patient Information
            </h3>
            {preSelectedPatient ? (
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                <p className="font-bold text-gray-800">
                  {preSelectedPatient.patient_name}
                </p>
                <p className="text-sm text-gray-600">
                  {preSelectedPatient.patient_gender} •{" "}
                  {preSelectedPatient.patient_age} years
                </p>
              </div>
            ) : (
              <select
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
              >
                <option value="">Select Patient</option>
                {doctorPatients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.patient_name} - {patient.patient_age}y,{" "}
                    {patient.patient_gender}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Vitals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Vitals (Optional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  BP (mmHg)
                </label>
                <input
                  type="text"
                  name="blood_pressure"
                  placeholder="120/80"
                  value={formData.blood_pressure}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring focus:ring-teal-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Temp (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  placeholder="98.6"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring focus:ring-teal-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  name="pulse_rate"
                  placeholder="72"
                  value={formData.pulse_rate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring focus:ring-teal-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  placeholder="70"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring focus:ring-teal-200"
                />
              </div>
            </div>
          </div>

          {/* Chief Complaint & Diagnosis */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chief Complaint *
              </label>
              <textarea
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Patient's main complaint..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnosis *
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Your diagnosis..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 resize-none"
              />
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Medications *
              </h3>
              <button
                type="button"
                onClick={addMedication}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {medications.map((med, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-4 relative"
                >
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={med.medicine_name}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "medicine_name",
                            e.target.value
                          )
                        }
                        required
                        placeholder="e.g., Paracetamol"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicationChange(index, "dosage", e.target.value)
                        }
                        required
                        placeholder="e.g., 500mg"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={med.frequency}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500"
                      >
                        <option value="once_daily">Once Daily</option>
                        <option value="twice_daily">Twice Daily</option>
                        <option value="thrice_daily">Three Times Daily</option>
                        <option value="four_times_daily">Four Times Daily</option>
                        <option value="as_needed">As Needed</option>
                        <option value="before_meals">Before Meals</option>
                        <option value="after_meals">After Meals</option>
                        <option value="at_bedtime">At Bedtime</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Duration *
                        </label>
                        <input
                          type="number"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          required
                          min="1"
                          placeholder="7"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          value={med.duration_unit}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration_unit",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500"
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "instructions",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Take with food"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Tests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Lab Tests (Optional)
              </h3>
              <button
                type="button"
                onClick={addLabTest}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Test
              </button>
            </div>

            {labTests.length > 0 && (
              <div className="space-y-3">
                {labTests.map((test, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start border-2 border-gray-200 rounded-lg p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeLabTest(index)}
                      className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={test.test_name}
                        onChange={(e) =>
                          handleLabTestChange(index, "test_name", e.target.value)
                        }
                        placeholder="Test name (e.g., CBC)"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                      />
                      <input
                        type="text"
                        value={test.instructions}
                        onChange={(e) =>
                          handleLabTestChange(
                            index,
                            "instructions",
                            e.target.value
                          )
                        }
                        placeholder="Instructions (optional)"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes & Follow-up */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional instructions..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/doctor/prescriptions")}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Create Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreatePrescription;
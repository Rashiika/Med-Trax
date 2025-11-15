import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPatientPrescriptions } from "../../redux/features/prescriptionSlice";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FileText,
  Calendar,
  Pill,
  User,
  Loader2,
  X,
  Activity,
  Clock,
  Thermometer,
  Weight,
} from "lucide-react";
import homeIcon from "../../assets/dashboard.svg";

import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";

const patientSidebarItems = [
  { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
  { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
  { label: "Chats", to: "/patient/chats", icon: chatsIcon },
  { label: "Prescriptions", to: "/patient/prescriptions", icon: <FileText className="w-5 h-5" /> },
  { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
  { label: "Profile", to: "/patient/profile", icon: profileIcon },
];

const PatientPrescriptions = () => {
  const dispatch = useDispatch();
  const { prescriptions, loading, error } = useSelector(
    (state) => state.prescription
  );

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPatientPrescriptions());
  }, [dispatch]);

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedPrescription(null);
  };

  const PrescriptionCard = ({ prescription }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {prescription.doctor_name}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {new Date(prescription.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 px-3 py-2 rounded-lg">
          <Pill className="w-4 h-4 text-teal-600" />
          <span className="text-teal-700 font-semibold text-sm">
            {prescription.medication_count} meds
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 font-semibold mb-1">Diagnosis:</p>
        <p className="text-gray-800">{prescription.diagnosis}</p>
      </div>

      <button
        onClick={() => handleViewDetails(prescription)}
        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
      >
        <FileText className="w-4 h-4" />
        View Full Prescription
      </button>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          <p className="ml-3 text-gray-600">Loading prescriptions...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            My Prescriptions
          </h2>
          <p className="text-gray-600 text-lg">
            View your prescription history and medications
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-2"></div>
        </div>

        {prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Prescriptions Yet
            </h3>
            <p className="text-gray-600">
              Your prescriptions will appear here after your doctor visits
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white z-10">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:bg-white hover:text-teal-600 rounded-full p-2 transition-all"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-2">Prescription Details</h2>
              <p className="text-teal-100">
                {new Date(selectedPrescription.created_at).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Doctor Info */}
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Doctor Information
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Name:</span>{" "}
                    {selectedPrescription.doctor_name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Specialization:</span>{" "}
                    {selectedPrescription.doctor_specialization}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Reg. No:</span>{" "}
                    {selectedPrescription.doctor_registration_number}
                  </p>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedPrescription.blood_pressure && (
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <Activity className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedPrescription.blood_pressure}
                    </p>
                  </div>
                )}
                {selectedPrescription.temperature && (
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Thermometer className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Temperature</p>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedPrescription.temperature}°F
                    </p>
                  </div>
                )}
                {selectedPrescription.pulse_rate && (
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Pulse Rate</p>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedPrescription.pulse_rate} bpm
                    </p>
                  </div>
                )}
                {selectedPrescription.weight && (
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <Weight className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Weight</p>
                    <p className="text-lg font-bold text-gray-800">
                      {selectedPrescription.weight} kg
                    </p>
                  </div>
                )}
              </div>

              {/* Chief Complaint & Diagnosis */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Chief Complaint:
                  </p>
                  <p className="text-gray-800">
                    {selectedPrescription.chief_complaint}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Diagnosis:
                  </p>
                  <p className="text-gray-800">{selectedPrescription.diagnosis}</p>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  Prescribed Medications
                </h3>
                <div className="space-y-3">
                  {selectedPrescription.medications?.map((med) => (
                    <div
                      key={med.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-bold text-gray-800 text-lg mb-2">
                        {med.medicine_name}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dosage:</p>
                          <p className="font-semibold text-gray-800">
                            {med.dosage}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Frequency:</p>
                          <p className="font-semibold text-gray-800">
                            {med.frequency_display}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration:</p>
                          <p className="font-semibold text-gray-800">
                            {med.duration} {med.duration_unit_display}
                          </p>
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-3 bg-yellow-50 rounded p-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Instructions:</span>{" "}
                            {med.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Tests */}
              {selectedPrescription.lab_tests?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-4">
                    Lab Tests Recommended
                  </h3>
                  <div className="space-y-3">
                    {selectedPrescription.lab_tests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                      >
                        <p className="font-semibold text-gray-800">
                          {test.test_name}
                        </p>
                        {test.instructions && (
                          <p className="text-sm text-gray-600 mt-1">
                            {test.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedPrescription.additional_notes && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    Additional Notes:
                  </p>
                  <p className="text-gray-800">
                    {selectedPrescription.additional_notes}
                  </p>
                </div>
              )}

              {/* Follow-up */}
              {selectedPrescription.follow_up_date && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Follow-up Appointment:
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {new Date(
                      selectedPrescription.follow_up_date
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientPrescriptions;
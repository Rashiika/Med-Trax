import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDoctorPatients,
  fetchDoctorPrescriptions,
} from "../../redux/features/prescriptionSlice";
import { showToast } from "../../components/Toast";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FileText,
  User,
  Calendar,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  Pill,
  Eye,
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
  { label: "Prescriptions", to: "/doctor/prescriptions", icon: <FileText className="w-5 h-5" /> },
  { label: "Blogs", to: "/doctor/blogs", icon: blogIcon },
  { label: "Profile", to: "/doctor/profile", icon: profileIcon },
];

const DoctorPrescriptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctorPatients, prescriptions, loading, error } = useSelector(
    (state) => state.prescription
  );

  const [selectedView, setSelectedView] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, [dispatch]);

  const handleViewPrescriptions = (patient) => {
    setSelectedPatient(patient);
    setSelectedView("prescriptions");
    dispatch(fetchDoctorPrescriptions(patient.id));
  };

  const handleBackToPatients = () => {
    setSelectedView("patients");
    setSelectedPatient(null);
  };

  const filteredPatients = doctorPatients.filter((patient) =>
    patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PrescriptionCard = ({ prescription }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {prescription.patient_name}
          </h3>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(prescription.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
          <Pill className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 font-semibold text-sm">
            {prescription.medication_count} meds
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 font-semibold mb-1">Diagnosis:</p>
        <p className="text-gray-800">{prescription.diagnosis}</p>
      </div>

      <button
        onClick={() => navigate(`/doctor/prescriptions/${prescription.id}`)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
    </div>
  );

  const PatientCard = ({ patient }) => {
    const initials = patient.patient_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-teal-500 hover:shadow-xl transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center border-2 border-teal-300">
            <span className="text-2xl font-bold text-teal-700">{initials}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">
              {patient.patient_name}
            </h3>
            <p className="text-gray-600 text-sm">
              {patient.patient_gender} • {patient.patient_age} years
            </p>
            <p className="text-gray-500 text-sm mt-1">{patient.phone_number}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Appointments</p>
            <p className="text-2xl font-bold text-blue-700">
              {patient.total_appointments}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Prescriptions</p>
            <p className="text-2xl font-bold text-green-700">
              {patient.prescription_count}
            </p>
          </div>
        </div>

        {patient.last_appointment && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 mb-1">Last Visit</p>
            <p className="text-sm font-semibold text-gray-800">
              {patient.last_appointment.date} at {patient.last_appointment.time}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => handleViewPrescriptions(patient)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View History
          </button>
          <button
            onClick={() => navigate("/doctor/prescriptions/create", { state: { patient } })}
            className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Rx
          </button>
        </div>
      </div>
    );
  };

  if (loading && selectedView === "patients") {
    return (
      <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="ml-3 text-gray-600">Loading patients...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {selectedView === "patients" ? "Patients" : `${selectedPatient?.patient_name}'s Prescriptions`}
              </h2>
              <p className="text-gray-600 text-lg">
                {selectedView === "patients"
                  ? "Manage prescriptions for your patients"
                  : "View prescription history"}
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-2"></div>
            </div>

            {selectedView === "patients" && (
              <button
                onClick={() => navigate("/doctor/prescriptions/create")}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Prescription
              </button>
            )}

            {selectedView === "prescriptions" && (
              <button
                onClick={handleBackToPatients}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
              >
                ← Back to Patients
              </button>
            )}
          </div>
        </div>

        {selectedView === "patients" && (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
                />
              </div>
            </div>

            {filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <User className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No Patients Found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Try a different search term"
                    : "You haven't had any confirmed appointments yet"}
                </p>
              </div>
            )}
          </>
        )}

        {selectedView === "prescriptions" && (
          <>
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="ml-3 text-gray-600">Loading prescriptions...</p>
              </div>
            ) : prescriptions.length > 0 ? (
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
                <p className="text-gray-600 mb-6">
                  Start by creating a prescription for this patient
                </p>
                <button
                  onClick={() =>
                    navigate("/doctor/prescriptions/create", {
                      state: { patient: selectedPatient },
                    })
                  }
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Prescription
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorPrescriptions;
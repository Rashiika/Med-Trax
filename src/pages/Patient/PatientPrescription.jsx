import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { Calendar, User, FileText, Download, Search, Filter } from "lucide-react";
import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";
import prescriptionIcon from "../../assets/Prescription.svg";

const patientSidebarItems = [
  { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
  { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
  { label: "Chats", to: "/patient/chats", icon: chatsIcon },
  { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
  { label: "Prescription", to: "/patient/prescription", icon: prescriptionIcon },
  { label: "Profile", to: "/patient/profile", icon: profileIcon },
];

const PatientPrescription = () => {
  const { user } = useSelector((state) => state.auth);
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, completed
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Sample prescriptions data - replace with actual API calls
  useEffect(() => {
    // Fetch patient's prescriptions from API
    const samplePrescriptions = [
      {
        id: 1,
        doctorName: "Dr. Sarah Johnson",
        doctorId: "D001",
        date: "2024-01-15",
        medications: [
          { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
          { name: "Paracetamol", dosage: "650mg", frequency: "As needed", duration: "5 days" }
        ],
        diagnosis: "Upper respiratory tract infection",
        notes: "Take with food. Follow up in 1 week if symptoms persist.",
        status: "active",
        followUpDate: "2024-01-22"
      },
      {
        id: 2,
        doctorName: "Dr. Michael Chen",
        doctorId: "D002", 
        date: "2024-01-10",
        medications: [
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" }
        ],
        diagnosis: "Hypertension management",
        notes: "Monitor blood pressure regularly. Next appointment in 4 weeks.",
        status: "active",
        followUpDate: "2024-02-07"
      },
      {
        id: 3,
        doctorName: "Dr. Emily Rodriguez",
        doctorId: "D003",
        date: "2024-01-05",
        medications: [
          { name: "Metformin", dosage: "850mg", frequency: "Twice daily", duration: "Ongoing" }
        ],
        diagnosis: "Type 2 Diabetes",
        notes: "Take with meals. Monitor blood sugar levels.",
        status: "completed",
        followUpDate: "2024-01-20"
      }
    ];
    setPrescriptions(samplePrescriptions);
  }, []);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => 
                           med.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesFilter = filterStatus === "all" || prescription.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleDownloadPrescription = (prescription) => {
    // Implement PDF download functionality
    console.log("Downloading prescription:", prescription.id);
    // This would typically generate and download a PDF
  };

  const PrescriptionDetailModal = ({ prescription, onClose }) => {
    if (!prescription) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Prescription Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Doctor</label>
                  <p className="text-lg font-semibold text-gray-800">{prescription.doctorName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Prescribed</label>
                  <p className="text-lg text-gray-800">{new Date(prescription.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="text-sm font-medium text-gray-600">Diagnosis</label>
                <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded-md">{prescription.diagnosis}</p>
              </div>

              {/* Medications */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-3 block">Prescribed Medications</label>
                <div className="space-y-3">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 text-lg mb-2">{med.name}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Dosage:</span>
                          <p className="text-gray-800">{med.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Frequency:</span>
                          <p className="text-gray-800">{med.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <p className="text-gray-800">{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {prescription.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Doctor's Notes</label>
                  <p className="text-gray-800 bg-blue-50 p-3 rounded-md">{prescription.notes}</p>
                </div>
              )}

              {/* Follow-up */}
              {prescription.followUpDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Follow-up Date</label>
                  <p className="text-gray-800">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadPrescription(prescription)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout sidebarItems={patientSidebarItems} role="patient">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Prescriptions</h1>
          <p className="text-gray-600">View and manage your medical prescriptions</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all" ? "No prescriptions found" : "No prescriptions yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Your prescriptions will appear here once doctors prescribe medications"
                }
              </p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div 
                key={prescription.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPrescription(prescription)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="text-blue-500" size={20} />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {prescription.doctorName}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        prescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar size={16} />
                      <span>Prescribed: {new Date(prescription.date).toLocaleDateString()}</span>
                      {prescription.followUpDate && (
                        <>
                          <span>•</span>
                          <span>Follow-up: {new Date(prescription.followUpDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-700 font-medium mb-3">
                      Diagnosis: <span className="font-normal">{prescription.diagnosis}</span>
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPrescription(prescription);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download prescription"
                  >
                    <Download size={16} />
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Medications:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {prescription.medications.slice(0, 2).map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md text-sm">
                        <span className="font-medium">{med.name}</span> - {med.dosage}
                      </div>
                    ))}
                    {prescription.medications.length > 2 && (
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                        +{prescription.medications.length - 2} more medications
                      </div>
                    )}
                  </div>
                </div>

                {prescription.notes && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Notes:</span> {prescription.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Prescription Detail Modal */}
        {selectedPrescription && (
          <PrescriptionDetailModal
            prescription={selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientPrescription;
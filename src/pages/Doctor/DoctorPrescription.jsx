import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { Plus, Search, Edit, Trash2, Calendar, User, FileText } from "lucide-react";
import homeIcon from "../../assets/dashboard.svg";
import appointmentIcon from "../../assets/appointment.svg";
import chatsIcon from "../../assets/chat.svg";
import profileIcon from "../../assets/profile.svg";
import blogIcon from "../../assets/blog.svg";
import prescriptionIcon from "../../assets/Prescription.svg";

const doctorSidebarItems = [
  { label: "Dashboard", to: "/doctor/dashboard", icon: homeIcon },
  { label: "Appointments", to: "/doctor/appointments", icon: appointmentIcon },
  { label: "Chats", to: "/doctor/chats", icon: chatsIcon },
  { label: "Blogs", to: "/doctor/blogs", icon: blogIcon },
  { label: "Prescription", to: "/doctor/prescription", icon: prescriptionIcon },
  { label: "Profile", to: "/doctor/profile", icon: profileIcon },
];

const DoctorPrescription = () => {
  const { user } = useSelector((state) => state.auth);
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);

  // Sample prescriptions data - replace with actual API calls
  useEffect(() => {
    // Fetch prescriptions from API
    const samplePrescriptions = [
      {
        id: 1,
        patientName: "John Doe",
        patientId: "P001",
        date: "2024-01-15",
        medications: [
          { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
          { name: "Paracetamol", dosage: "650mg", frequency: "As needed", duration: "5 days" }
        ],
        diagnosis: "Upper respiratory tract infection",
        notes: "Take with food. Follow up in 1 week if symptoms persist."
      },
      {
        id: 2,
        patientName: "Jane Smith",
        patientId: "P002",
        date: "2024-01-14",
        medications: [
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" }
        ],
        diagnosis: "Hypertension",
        notes: "Monitor blood pressure regularly. Next appointment in 4 weeks."
      }
    ];
    setPrescriptions(samplePrescriptions);
  }, []);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePrescription = () => {
    setEditingPrescription(null);
    setShowCreateForm(true);
  };

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setShowCreateForm(true);
  };

  const handleDeletePrescription = (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    }
  };

  const PrescriptionForm = ({ prescription, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      patientName: prescription?.patientName || "",
      patientId: prescription?.patientId || "",
      diagnosis: prescription?.diagnosis || "",
      medications: prescription?.medications || [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: prescription?.notes || ""
    });

    const addMedication = () => {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "" }]
      }));
    };

    const removeMedication = (index) => {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    };

    const updateMedication = (index, field, value) => {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.map((med, i) => 
          i === index ? { ...med, [field]: value } : med
        )
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newPrescription = {
        ...formData,
        id: prescription?.id || Date.now(),
        date: prescription?.date || new Date().toISOString().split('T')[0]
      };
      
      if (prescription) {
        setPrescriptions(prev => prev.map(p => p.id === prescription.id ? newPrescription : p));
      } else {
        setPrescriptions(prev => [...prev, newPrescription]);
      }
      
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {prescription ? "Edit Prescription" : "Create New Prescription"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Medications
                  </label>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus size={16} />
                    Add Medication
                  </button>
                </div>
                
                {formData.medications.map((medication, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Medicine Name"
                        value={medication.name}
                        onChange={(e) => updateMedication(index, "name", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, "duration", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any additional instructions or notes..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {prescription ? "Update" : "Create"} Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Prescriptions</h1>
          <p className="text-gray-600">Manage and track patient prescriptions</p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by patient name, ID, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreatePrescription}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            New Prescription
          </button>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No prescriptions found" : "No prescriptions yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search criteria" 
                  : "Create your first prescription to get started"
                }
              </p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <User className="text-blue-500" size={20} />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {prescription.patientName}
                      </h3>
                      <span className="text-sm text-gray-500">({prescription.patientId})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar size={16} />
                      <span>{new Date(prescription.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                      Diagnosis: <span className="font-normal">{prescription.diagnosis}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPrescription(prescription)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit prescription"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePrescription(prescription.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete prescription"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Medications:</h4>
                  <div className="space-y-2">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span><strong>Medicine:</strong> {med.name}</span>
                          <span><strong>Dosage:</strong> {med.dosage}</span>
                          <span><strong>Frequency:</strong> {med.frequency}</span>
                          <span><strong>Duration:</strong> {med.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.notes && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-800 mb-1">Notes:</h4>
                    <p className="text-gray-700 text-sm">{prescription.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Prescription Form Modal */}
        {showCreateForm && (
          <PrescriptionForm
            prescription={editingPrescription}
            onClose={() => setShowCreateForm(false)}
            onSave={() => setShowCreateForm(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorPrescription;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientProfile, updatePatientProfile } from '../../redux/features/userSlice';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader2, Heart, Shield } from 'lucide-react';
import profileImage from '../../assets/patient_profile.avif';
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';
import { FileText } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", to: "/patient/dashboard", icon: homeIcon },
  { label: "Appointments", to: "/patient/appointments", icon: appointmentIcon },
  { label: "Chats", to: "/patient/chats", icon: chatsIcon },
  { label: 'Prescriptions', to: '/patient/prescriptions', icon: <FileText className="w-5 h-5" /> },
  { label: "Blogs", to: "/patient/blogs", icon: blogIcon },
  { label: "Profile", to: "/patient/profile", icon: profileIcon },
];

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const { patientProfile: profile, loading, error } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    dispatch(fetchPatientProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        emergency_contact: profile.emergency_contact || '',
        emergency_email: profile.emergency_email || '',
        city: profile.city || '',
        is_insurance: profile.is_insurance || false,
        ins_company_name: profile.ins_company_name || '',
        ins_policy_number: profile.ins_policy_number || '',
        known_allergies: profile.known_allergies || '',
        chronic_diseases: profile.chronic_diseases || '',
        previous_surgeries: profile.previous_surgeries || '',
        family_medical_history: profile.family_medical_history || '',
      });
    }
  }, [profile]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        emergency_contact: profile.emergency_contact || '',
        emergency_email: profile.emergency_email || '',
        city: profile.city || '',
        is_insurance: profile.is_insurance || false,
        ins_company_name: profile.ins_company_name || '',
        ins_policy_number: profile.ins_policy_number || '',
        known_allergies: profile.known_allergies || '',
        chronic_diseases: profile.chronic_diseases || '',
        previous_surgeries: profile.previous_surgeries || '',
        family_medical_history: profile.family_medical_history || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updatePatientProfile(formData)).unwrap();
      toast.success('✅ Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.error || 'Failed to update profile');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();

  if (loading || !profile) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} role={role}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="ml-3 text-gray-600">Loading Patient Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} role={role}>
        <div className="text-center p-12 border-l-4 border-red-500 bg-red-50 rounded-xl">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h3>
          <p className="text-gray-600">Failed to fetch profile data. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} role={role}>
      <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Profile Card & Emergency */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
                </div>
                
                {isEditing ? (
                  <div className="space-y-2 mb-4">
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full text-center text-xl font-bold px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full text-center text-xl font-bold px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{fullName}</h2>
                )}
                
                <p className="text-gray-500 text-sm mb-4">@{profile.username}</p>
                
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <p className="text-blue-600 font-medium">{profile.phone_number || 'No phone'}</p>
                  )}
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-red-500 mr-2">🚨</span> Emergency Contact
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.emergency_contact}
                        onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Emergency Number"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.emergency_email}
                        onChange={(e) => handleInputChange('emergency_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Emergency Email"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-800">{profile.emergency_contact || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-800">{profile.emergency_email || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - General Info & Medical History */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">General Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Edit profile"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Date of Birth:</span>
                    <span className="text-gray-800">{formatDate(profile.date_of_birth)}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Gender:</span>
                    <span className="text-gray-800">{profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'}</span>
                  </div>
                  
                  {isEditing ? (
                    <div className="py-2 border-b border-gray-100">
                      <label className="text-gray-600 font-medium block mb-1">Address (City):</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Address (City):</span>
                      <span className="text-gray-800">{profile.city}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Blood Group:</span>
                    <span className="text-red-600 font-bold">{profile.blood_group}</span>
                  </div>
                </div>
              </div>

              {/* Anamnesis & Medical History */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Anamnesis & History</h3>
                  {isEditing && <Edit2 className="w-5 h-5 text-blue-600" />}
                </div>

                <div className="space-y-3 text-sm">
                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Known Allergies:</label>
                      <textarea
                        value={formData.known_allergies}
                        onChange={(e) => handleInputChange('known_allergies', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Penicillin, Peanuts, Latex"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Known Allergies:</span>
                      <span className="text-gray-800">{profile.known_allergies || 'None recorded'}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Chronic Diseases:</label>
                      <textarea
                        value={formData.chronic_diseases}
                        onChange={(e) => handleInputChange('chronic_diseases', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Diabetes, Hypertension"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Chronic Diseases:</span>
                      <span className="text-gray-800">{profile.chronic_diseases || 'None'}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Previous Surgeries:</label>
                      <textarea
                        value={formData.previous_surgeries}
                        onChange={(e) => handleInputChange('previous_surgeries', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Appendectomy (2015)"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Previous Surgeries:</span>
                      <span className="text-gray-800">{profile.previous_surgeries || 'None'}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Family Medical History:</label>
                      <textarea
                        value={formData.family_medical_history}
                        onChange={(e) => handleInputChange('family_medical_history', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Father: Hypertension, Mother: Diabetes"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Family History:</span>
                      <span className="text-gray-800">{profile.family_medical_history || 'None recorded'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Insurance Details
                  </h3>
                  {isEditing && <Edit2 className="w-5 h-5 text-blue-600" />}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="is_insurance"
                        checked={formData.is_insurance}
                        onChange={(e) => handleInputChange('is_insurance', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="is_insurance" className="text-gray-700 font-medium">
                        I have insurance coverage
                      </label>
                    </div>

                    {formData.is_insurance && (
                      <>
                        <div>
                          <label className="text-gray-600 font-medium block mb-1">Company Name:</label>
                          <input
                            type="text"
                            value={formData.ins_company_name}
                            onChange={(e) => handleInputChange('ins_company_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Insurance Company"
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 font-medium block mb-1">Policy Number:</label>
                          <input
                            type="text"
                            value={formData.ins_policy_number}
                            onChange={(e) => handleInputChange('ins_policy_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Policy Number"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {profile.is_insurance ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Company:</span>
                          <span className="text-gray-800">{profile.ins_company_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">Policy Number:</span>
                          <span className="text-gray-800">{profile.ins_policy_number || 'N/A'}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No insurance coverage</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
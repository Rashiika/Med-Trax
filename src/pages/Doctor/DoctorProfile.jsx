import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile, updateDoctorProfile } from '../../redux/features/userSlice';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { User, Mail, Phone, MapPin, Calendar, Heart, Award, Edit2, Save, X, Loader2, Clock, Stethoscope } from 'lucide-react';
import homeIcon from '../../assets/dashboard.svg';
import appointmentIcon from '../../assets/appointment.svg';
import chatsIcon from '../../assets/chat.svg';
import profileIcon from '../../assets/profile.svg';
import blogIcon from '../../assets/blog.svg';
import { FileText } from "lucide-react";

const doctorSidebarItems = [
  { label: 'Dashboard', to: '/doctor/dashboard', icon: homeIcon },
  { label: 'Appointments', to: '/doctor/appointments', icon: appointmentIcon },
  { label: 'Chats', to: '/doctor/chats', icon: chatsIcon },
  { label: 'Prescriptions', to: '/doctor/prescriptions', icon: <FileText className="w-5 h-5" /> },
  { label: 'Blogs', to: '/doctor/blogs', icon: blogIcon },
  { label: 'Profile', to: '/doctor/profile', icon: profileIcon },
];

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { doctorProfile: profile, loading, error } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    dispatch(fetchDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        alternate_phone_number: profile.alternate_phone_number || '',
        alternate_email: profile.alternate_email || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        clinic_name: profile.clinic_name || '',
        years_of_experience: profile.years_of_experience || '',
        emergency_contact_person: profile.emergency_contact_person || '',
        emergency_contact_number: profile.emergency_contact_number || '',
        marital_status: profile.marital_status || '',
        qualification: profile.qualification || '',
        department: profile.department || '',
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
        alternate_phone_number: profile.alternate_phone_number || '',
        alternate_email: profile.alternate_email || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        clinic_name: profile.clinic_name || '',
        years_of_experience: profile.years_of_experience || '',
        emergency_contact_person: profile.emergency_contact_person || '',
        emergency_contact_number: profile.emergency_contact_number || '',
        marital_status: profile.marital_status || '',
        qualification: profile.qualification || '',
        department: profile.department || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateDoctorProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
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
      <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="ml-3 text-gray-600">Loading Doctor Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
        <div className="text-center p-12 border-l-4 border-red-500 bg-red-50 rounded-xl">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h3>
          <p className="text-gray-600">Failed to fetch profile data. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={doctorSidebarItems} role="doctor">
      <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="w-16 h-16 text-blue-600" />
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Dr. {fullName}</h2>
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
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-red-500 mr-2">🚨</span> Emergency Contact
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={formData.emergency_contact_person}
                        onChange={(e) => handleInputChange('emergency_contact_person', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.emergency_contact_number}
                        onChange={(e) => handleInputChange('emergency_contact_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Emergency Number"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-800">{profile.emergency_contact_number || 'N/A'}</p>
                    </div>
                    {profile.emergency_contact_person && (
                      <div>
                        <span className="text-gray-500">Person:</span>
                        <p className="font-medium text-gray-800">{profile.emergency_contact_person}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
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

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Registration No.:</span>
                    <span className="text-gray-800">{profile.registration_number}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Specialization:</span>
                    <span className="text-gray-800">{profile.specialization}</span>
                  </div>

                  {isEditing ? (
                    <div className="py-2 border-b border-gray-100">
                      <label className="text-gray-600 font-medium block mb-1">Department:</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Department:</span>
                      <span className="text-gray-800">{profile.department}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="py-2 border-b border-gray-100">
                      <label className="text-gray-600 font-medium block mb-1">Qualification:</label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Qualification:</span>
                      <span className="text-gray-800">{profile.qualification}</span>
                    </div>
                  )}

 {isEditing ? (
  <div className="py-2 border-b border-gray-100">
    <label className="text-gray-600 font-medium block mb-1">Experience (Years):</label>
    <input
      type="number"
      value={formData.years_of_experience}
      onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
      min={profile.years_of_experience}
      max="99"
      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
    />
  </div>
) : (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-gray-600 font-medium">Experience:</span>
    <span className="text-gray-800">{profile.years_of_experience} Years</span>
  </div>
)}
                </div>
              </div>

              {/* Contact & Address Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Contact & Address Details</h3>
                  {isEditing && (
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Clinic Name:</label>
                      <input
                        type="text"
                        value={formData.clinic_name}
                        onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Clinic Name:</span>
                      <span className="text-gray-800">{profile.clinic_name || 'N/A'}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Alternate Phone:</label>
                      <input
                        type="tel"
                        value={formData.alternate_phone_number}
                        onChange={(e) => handleInputChange('alternate_phone_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Alternate Phone:</span>
                      <span className="text-gray-800">{profile.alternate_phone_number || 'N/A'}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Alternate Email:</label>
                      <input
                        type="email"
                        value={formData.alternate_email}
                        onChange={(e) => handleInputChange('alternate_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Alternate Email:</span>
                      <span className="text-gray-800">{profile.alternate_email || 'N/A'}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Full Address:</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Full Address:</span>
                      <span className="text-gray-800">{profile.address}</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">State:</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Pincode:</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Location:</span>
                      <span className="text-gray-800">{profile.state} - {profile.pincode} ({profile.country})</span>
                    </div>
                  )}
                  
                  {isEditing ? (
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Marital Status:</label>
                      <select
                        value={formData.marital_status}
                        onChange={(e) => handleInputChange('marital_status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Marital Status:</span>
                      <span className="text-gray-800">{profile.marital_status || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
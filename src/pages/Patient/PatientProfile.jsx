import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/Layout/DashboardLayout'; 
import { useNavigate } from 'react-router-dom';
import profileImage from '../../assets/patient_profile.avif';
import { fetchPatientProfile } from '../../redux/features/userSlice';

const DashboardIcon = '🏠';
const AppointmentsIcon = '📅';
const ChatsIcon = '💬';
const BlogsIcon = '📝';
const ProfileIcon = '👤';

const sidebarItems = [
    { label: "Dashboard", to: "/patient/dashboard", icon: DashboardIcon },
    { label: "Appointments", to: "/patient/appointments", icon: AppointmentsIcon },
    { label: "Chats", to: "/patient/chats", icon: ChatsIcon },
    { label: "Blogs", to: "/patient/blogs", icon: BlogsIcon },
    { label: "Profile", to: "/patient/profile", icon: ProfileIcon },
];


const PatientProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { role } = useSelector((state) => state.auth); 
    const { patientProfile, loading } = useSelector((state) => state.user); 
    const rolePrefix = role === 'doctor' ? '/doctor' : '/patient';

    const mockProfile = {
        first_name: "Kate",
        last_name: "Prokopchuk",
        email: "katepro@example.com",
        username: "kate_p",
        date_of_birth: "1994-07-23", 
        blood_group: "A+",
        gender: "F",
        city: "Lviv, Chornovola street, 67",
        phone_number: "+38 (093) 23 45 678",
        emergency_contact: "+38 (093) 12 34 567",
        emergency_email: "emergency@example.com",
        is_insurance: true,
        ins_company_name: "Liberty Mutual",
        ins_policy_number: "INS-900234X",
        known_allergies: "Nuts, Pollen",
        chronic_diseases: "Asthma",
        previous_surgeries: "None",
        family_medical_history: "Diabetes (Grandmother)",
        created_at: "2025-11-07T23:15:47.578Z",
        profileImage: "https://via.placeholder.com/150", 
    };
    
    const profile = patientProfile || mockProfile;
    const fullName = `${profile.first_name} ${profile.last_name}`;

    useEffect(() => {
        dispatch(fetchPatientProfile());
    }, [dispatch]);

    const formatReadableDate = (isoDate) => {
        if (!isoDate) return 'N/A';
        try {
            return new Date(isoDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch {
            return isoDate;
        }
    };


    if (loading) {
        return <DashboardLayout sidebarItems={sidebarItems} role={role}><div className="p-8 text-center">Loading Profile...</div></DashboardLayout>;
    }

    return (
        <DashboardLayout sidebarItems={sidebarItems} role={role}>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header Actions */}
                {/* <div className="flex justify-end mb-6 space-x-3">
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
                        PRINT
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm font-medium">
                        EDIT
                    </button>
                </div> */}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 1. Left Column: Personal Card & Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* A. Profile Overview Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                                <img src={profileImage} alt={fullName} className="w-full h-full object-cover" /> 
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{fullName}</h2>
                            <p className="text-gray-500 text-sm mb-4">@{profile.username}</p>
                            
                            <div className="w-full space-y-1 pt-3 border-t">
                                <p className="text-blue-600 font-medium">{profile.phone_number}</p>
                                <p className="text-gray-500 text-sm">{profile.email}</p>
                            </div>
                        </div>

                        {/* B. Emergency Contact Block */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                🚨 Emergency Contact
                            </h3>
                            <div className="space-y-3 text-gray-700 text-sm">
                                <div className="flex">
                                    <span className="w-28 font-medium text-gray-600">Phone:</span>
                                    <span>{profile.emergency_contact}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 font-medium text-gray-600">Email:</span>
                                    <span>{profile.emergency_email}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 2. Right Columns: Health Information */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* A. General Information Block */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
                                General Information 
                                <button aria-label="Edit General Information" className="text-gray-500 hover:text-blue-600">✏</button>
                            </h3>
                            <div className="space-y-3 text-gray-700 text-sm">
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Date of Birth:</span>
                                    <span>{formatReadableDate(profile.date_of_birth)}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Gender:</span>
                                    <span>{profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other/N/A'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Address (City):</span>
                                    <span>{profile.city}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Blood Group:</span>
                                    <span className="font-bold text-red-600">{profile.blood_group}</span>
                                </div>
                            </div>
                        </div>

                        {/* B. Anamnesis (Medical History) Block */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
                                Anamnesis & History 
                                <button aria-label="Edit Anamnesis" className="text-gray-500 hover:text-blue-600">✏</button>
                            </h3>
                            <div className="space-y-3 text-gray-700 text-sm">
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Known Allergies:</span>
                                    <span>{profile.known_allergies || 'None recorded'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Chronic Diseases:</span>
                                    <span>{profile.chronic_diseases || 'None'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Previous Surgeries:</span>
                                    <span>{profile.previous_surgeries || 'None'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-40 font-medium text-gray-600">Family History:</span>
                                    <span>{profile.family_medical_history || 'None recorded'}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* C. Insurance Details Block */}
                        {profile.is_insurance && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
                                    Insurance Details 
                                    <button aria-label="Edit Insurance" className="text-gray-500 hover:text-blue-600">✏</button>
                                </h3>
                                <div className="space-y-3 text-gray-700 text-sm">
                                    <div className="flex">
                                        <span className="w-40 font-medium text-gray-600">Company:</span>
                                        <span>{profile.ins_company_name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-40 font-medium text-gray-600">Policy Number:</span>
                                        <span>{profile.ins_policy_number}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PatientProfile;
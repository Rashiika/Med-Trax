import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile } from '../../redux/features/userSlice'; 
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { User, Stethoscope, Mail, Phone, MapPin, Calendar, Heart, Clock, Loader2, Award } from 'lucide-react';
import { format } from 'date-fns';

const homeIcon = '🏠';
const appointmentIcon = '📅';
const chatsIcon = '💬';
const profileIcon = '⚙';
const blogIcon = '📝'; 

const doctorSidebarItems = [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: homeIcon },
    { label: 'Appointments', to: '/doctor/appointments', icon: appointmentIcon },
    { label: 'Chats', to: '/doctor/chats', icon: chatsIcon },
    { label: 'Blogs', to: '/doctor/blogs', icon: blogIcon },
    { label: 'Profile', to: '/doctor/profile', icon: profileIcon },
];

const DataRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start text-gray-700 space-x-3 py-2 border-b border-gray-100 last:border-b-0">
        <Icon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
        <div className='flex flex-col'>
            <span className="text-sm font-medium text-gray-500">{label}:</span>
            <span className="font-semibold text-gray-800">{value || 'N/A'}</span>
        </div>
    </div>
);

const DoctorProfile = () => {
    const dispatch = useDispatch();

    const { doctorProfile: profile, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchDoctorProfile());
    }, [dispatch]);

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
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h2>
                    <p className="text-gray-600 text-lg">Review and manage your professional credentials and contact information.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-extrabold text-gray-800">
                                    Dr. {fullName}
                                </h3>
                                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                    profile.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {profile.is_approved ? 'Approved' : 'Pending Review'}
                                </span>
                            </div>
                            
                            <p className="text-lg text-blue-600 font-semibold flex items-center space-x-2 mb-4">
                                <Stethoscope className="w-5 h-5"/>
                                <span>{profile.specialization} - {profile.department}</span>
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DataRow icon={Award} label="Registration No." value={profile.registration_number} />
                                <DataRow icon={User} label="Username" value={profile.username} />
                                <DataRow icon={Calendar} label="Date of Birth" value={profile.date_of_birth ? format(new Date(profile.date_of_birth), 'MMM dd, yyyy') : 'N/A'} />
                                <DataRow icon={Clock} label="Experience" value={` ${profile.years_of_experience} Years`} />
                                <DataRow icon={Stethoscope} label="Qualification" value={profile.qualification} />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <Phone className="w-6 h-6 text-blue-500" />
                                <span>Clinic & Contact Details</span>
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <DataRow icon={MapPin} label="Clinic Name" value={profile.clinic_name} />
                                <DataRow icon={Phone} label="Primary Phone" value={profile.phone_number} />
                                <DataRow icon={Mail} label="Primary Email" value={profile.email} />
                                <DataRow icon={Phone} label="Alternate Phone" value={profile.alternate_phone_number} />
                                <DataRow icon={Mail} label="Alternate Email" value={profile.alternate_email} />
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1 space-y-6">

                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <MapPin className="w-6 h-6 text-blue-500" />
                                <span>Practice Address</span>
                            </h3>
                            <p className="text-gray-800 font-medium">{profile.address}</p>
                            <p className="text-gray-600 text-sm mt-1">
                                {profile.city}, {profile.state} - {profile.pincode} ({profile.country})
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-400">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <Heart className="w-6 h-6 text-red-500" />
                                <span>Medical & Emergency</span>
                            </h3>
                            
                            <DataRow icon={Heart} label="Blood Group" value={profile.blood_group} />
                            <DataRow icon={User} label="Marital Status" value={profile.marital_status} />
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="font-semibold text-sm text-gray-600 mb-1">Emergency Contact:</p>
                                <p className="text-gray-800">{profile.emergency_contact_person}</p>
                                <p className="text-sm text-red-500">{profile.emergency_contact_number}</p>
                            </div>
                        </div>
                        
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md">
                            Edit Profile
                        </button>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorProfile;
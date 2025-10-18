import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const RoleSelectionPage = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        navigate('/login', { state: { role: role } });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="mb-12">
                <img src={logo} alt="Med-Trax Logo" className="w-auto h-20" />
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Med-Trax</h1>
                <p className="text-lg text-gray-600 mb-12">Please select your role to continue.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8">
                <button
                    onClick={() => handleRoleSelection('patient')}
                    className="w-64 h-40 bg-white shadow-xl rounded-2xl flex flex-col items-center justify-center text-xl font-semibold text-gray-700 hover:bg-blue-500 hover:text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                    <span className="text-5xl mb-3"></span>
                    I am a Patient
                </button>
                <button
                    onClick={() => handleRoleSelection('doctor')}
                    className="w-64 h-40 bg-white shadow-xl rounded-2xl flex flex-col items-center justify-center text-xl font-semibold text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                    <span className="text-5xl mb-3"></span>
                    I am a Doctor
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
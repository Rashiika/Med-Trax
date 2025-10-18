import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to the Dashboard!
                </h1>
                <p className="text-gray-600 mb-8">
                    You have successfully logged in.
                </p>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
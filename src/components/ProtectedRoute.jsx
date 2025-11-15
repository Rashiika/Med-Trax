import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';






const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, isProfileComplete, role, loading } = useSelector(state => state.auth);
    const location = useLocation(); 

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated || !isProfileComplete) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (requiredRole && role !== requiredRole) {
        const redirectTo = role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
        return <Navigate to={redirectTo} replace />;
    }
    
    return children;
};

export default ProtectedRoute;
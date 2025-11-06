import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, isProfileComplete, role, isHydrating } = useSelector(state => state.auth);
    const location = useLocation();
    
    // Debug logging
    console.log("ProtectedRoute Debug:", { 
        isAuthenticated, 
        isProfileComplete, 
        role, 
        requiredRole, 
        isHydrating,
        currentPath: location.pathname 
    });
    
    // Show loading while hydrating
    if (isHydrating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    // Check if user is authenticated and profile is complete
    if (!isAuthenticated || !isProfileComplete) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Check role requirements
    if (requiredRole && role !== requiredRole) {
        const redirectTo = role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
        return <Navigate to={redirectTo} replace />;
    }
    
    return children;
};

export default ProtectedRoute;
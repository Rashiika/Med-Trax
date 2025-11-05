import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, isProfileComplete, role } = useSelector(state => state.auth);
    const location = useLocation();
    
    // Debug logging
    console.log("ProtectedRoute Debug:", { 
        isAuthenticated, 
        isProfileComplete, 
        role, 
        requiredRole, 
        currentPath: location.pathname 
    });
    
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
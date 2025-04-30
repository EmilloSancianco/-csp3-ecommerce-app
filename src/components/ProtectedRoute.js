import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

const ProtectedRoute = ({ element, adminOnly = false }) => {
    const { user } = useContext(UserContext);

    // Retrieve token from localStorage or UserContext
    const token = localStorage.getItem('token') || user?.token;

    // Redirect all non-logged-in users to login if no token is found
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Redirect non-admin users from admin-only routes
    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/admin" />;
    }

    // Optionally, you could make a token validation API request here
    // If token is valid, return the protected component
    return element;
};

export default ProtectedRoute;

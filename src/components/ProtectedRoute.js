import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../UserContext';

const ProtectedRoute = ({ element, redirectTo = "/", adminOnly = false, ...rest }) => {
    const { user } = useContext(UserContext);

    // Redirect logged-in users from /login and /register to home
    if (user.id && !adminOnly) {
        return <Navigate to={redirectTo} />;
    }

    // Redirect non-admin users to home from admin route
    if (adminOnly && !user.isAdmin) {
        return <Navigate to={redirectTo} />;
    }

    return element; // Return the component if conditions are met
};

export default ProtectedRoute;

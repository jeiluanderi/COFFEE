import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // We'll use your AuthContext
import Spinner from './Spinner'; // Optional: show a spinner while checking

const ProtectedRoute = ({ children }) => {
    // Get the user and loading status from your AuthContext
    const { user, loading } = useAuth();
    const location = useLocation();

    // If the authentication status is still being determined, show a loading spinner.
    // This prevents a flicker where the login page briefly appears for a logged-in user.
    if (loading) {
        return <Spinner />;
    }

    // If loading is finished and there is no user...
    if (!user) {
        // ...redirect them to the /login page.
        // We pass the current location in the `state` object. This allows us to
        // redirect the user back to the page they were trying to access after they log in.
        // The `replace` prop ensures the login page replaces the current history entry.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If loading is finished and a user exists, render the child component (the page they want).
    return children;
};

export default ProtectedRoute;
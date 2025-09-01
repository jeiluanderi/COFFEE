import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if a token exists in localStorage
    const isAuthenticated = localStorage.getItem('token');

    // If a token exists, render the child routes (the dashboard)
    if (isAuthenticated) {
        return <Outlet />;
    }

    // If no token exists, redirect the user to the login page
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
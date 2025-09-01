// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// You might need jwtDecode if you're decoding the token on the client-side for user details,
// but for simple storage and retrieval, it's not strictly necessary here.
// import { jwtDecode } from 'jwt-decode';

// Create a new context for authentication.
export const AuthContext = createContext();

// Create a custom hook for easy access to the auth context.
export const useAuth = () => useContext(AuthContext);

// The provider component that manages and provides authentication state.
export const AuthProvider = ({ children }) => {
    // Initialize the token state from localStorage.
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('token') || null;
        } catch (error) {
            console.error("Failed to read token from localStorage", error);
            return null;
        }
    });

    // Initialize user data from localStorage, or decode from token if available.
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                return JSON.parse(storedUser);
            }
            // If no user object, but token exists, you might decode it here
            // const storedToken = localStorage.getItem('token');
            // if (storedToken) {
            //     return jwtDecode(storedToken); // Requires jwt-decode
            // }
            return null;
        } catch (error) {
            console.error("Failed to parse user from localStorage or decode token", error);
            return null;
        }
    });

    // Determine login status based on token presence.
    const isLoggedIn = !!token; // True if token exists, false otherwise.

    // Effect to update localStorage whenever token or user changes.
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [token, user]); // Depend on token and user state.

    // Login function to set the token and user data.
    // This function will be called by your LoginPage with actual data from the backend.
    const login = (backendToken, userData) => {
        setToken(backendToken);
        setUser(userData);
        // localStorage is updated via useEffect.
    };

    // Logout function to clear the token and user data.
    const logout = () => {
        setToken(null);
        setUser(null);
        // localStorage is updated via useEffect.
    };

    // The value object provided to consuming components.
    const authContextValue = {
        isLoggedIn,
        user,
        token, // Provide the token to context consumers as well
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'; // Added Link for direct use
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx'; // Verified import path

const colors = {
    primary: '#6F4E37', // Coffee brown
    secondary: '#A0522D', // Lighter brown
    dark: '#3E2723', // Dark coffee
    light: '#F5F5DC', // Creamy background
};

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from AuthContext

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Your backend expects email and password for login.
            const response = await axios.post(`http://localhost:3001/api/login`, formData);

            const { token, user } = response.data; // Expecting token and user from backend

            if (!token || !user) {
                setError("Login failed: Invalid response from server.");
                return;
            }

            // Call the login function from AuthContext to save token and user data.
            login(token, user);

            // Redirect based on user role (if applicable, otherwise just to home)
            if (user.role === 'admin') {
                // IMPORTANT: Ensure process.env.REACT_APP_ADMIN_URL is defined in your .env file
                window.location.href = process.env.REACT_APP_ADMIN_URL || 'http://localhost:5174';
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error("Login failed:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container-fluid py-5" style={{ backgroundColor: colors.light }}>
                <style>
                    {`
                    .auth-form-container {
                        background-color: white;
                        border-radius: 8px;
                        padding: 2.5rem;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    }
                    .form-control {
                        border: 1px solid ${colors.secondary};
                        color: ${colors.dark};
                        background-color: white;
                    }
                    .form-floating label {
                        color: ${colors.secondary};
                    }
                    .form-control:focus {
                        border-color: ${colors.primary};
                        box-shadow: 0 0 0 0.25rem rgba(139, 69, 19, 0.25);
                    }
                    .btn-primary-custom {
                        background-color: ${colors.primary};
                        border-color: ${colors.primary};
                        color: white;
                        transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
                    }
                    .btn-primary-custom:hover {
                        background-color: ${colors.dark};
                        border-color: ${colors.dark};
                        transform: translateY(-2px);
                    }
                    .error-message {
                        color: #dc3545;
                        margin-top: 1rem;
                    }
                    `}
                </style>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                            <div className="auth-form-container">
                                <h2 className="text-center mb-4" style={{ color: colors.dark }}>Welcome Back!</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="email" // Added autocomplete
                                                />
                                                <label htmlFor="email">Email address</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="current-password" // Added autocomplete
                                                />
                                                <label htmlFor="password">Password</label>
                                            </div>
                                        </div>
                                        {error && <div className="col-12 text-center error-message">{error}</div>}
                                        <div className="col-12 text-center mt-4">
                                            <button
                                                className="btn btn-primary-custom py-3 px-4 w-100"
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Logging In...' : 'Login'}
                                            </button>
                                        </div>
                                        <div className="col-12 text-center mt-3">
                                            <p className="mb-0" style={{ color: colors.secondary }}>Don't have an account? <Link to="/signup" style={{ color: colors.primary, textDecoration: 'none' }}>Sign Up here</Link></p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;

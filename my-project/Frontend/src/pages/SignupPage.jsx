// src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import Spinner from '../components/Shared/Spinner';
import { Link, useNavigate } from 'react-router-dom';
// import PageHeader from '../components/Shared/PageHeader';

const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Define color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Corrected fetch call to use the /api/register endpoint
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
                credentials: 'omit', // This ensures no token is sent
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || 'Registration successful! You can now log in.');
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Could not connect to the server.');
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            {/* <PageHeader title="Sign Up" activePage="Sign Up" /> */}
            <div className="container-xxl py-5" style={{ backgroundColor: colors.light }}>
                <style jsx="true">{`
                    .error-message { color: #dc3545; }
                    .success-message { color: #28a745; }
                    .form-floating > .form-control:not(:placeholder-shown) ~ label {
                        opacity: .65;
                        transform: scale(.85) translateY(-.5rem) translateX(.15rem);
                    }
                `}</style>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8 col-sm-10">
                            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                                <h5 className="section-title ff-secondary text-center text-primary fw-normal" style={{ color: colors.primary }}>Sign Up</h5>
                                <h1 className="mb-5" style={{ color: colors.dark }}>Create your account</h1>
                            </div>
                            <div className="wow fadeInUp" data-wow-delay="0.2s">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="username"
                                                />
                                                <label htmlFor="username">Username</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Your Email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="email"
                                                />
                                                <label htmlFor="email">Your Email</label>
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
                                                    autoComplete="new-password"
                                                />
                                                <label htmlFor="password">Password</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="new-password"
                                                />
                                                <label htmlFor="confirmPassword">Confirm Password</label>
                                            </div>
                                        </div>
                                        {error && <div className="col-12 text-center error-message">{error}</div>}
                                        {successMessage && <div className="col-12 text-center success-message">{successMessage}</div>}
                                        <div className="col-12 text-center mt-4">
                                            <button className="btn py-3 px-4 w-100" type="submit" style={{ backgroundColor: colors.primary, color: colors.light }}>Sign Up</button>
                                        </div>
                                        <div className="col-12 text-center mt-3">
                                            <p className="mb-0" style={{ color: colors.secondary }}>Already have an account? <Link to="/login" style={{ color: colors.primary, textDecoration: 'none' }}>Login here</Link></p>
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
};

export default SignupPage;

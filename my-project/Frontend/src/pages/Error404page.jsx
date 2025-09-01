// src/pages/Error404Page.jsx
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/shared/PageHeader'; // Adjust path if necessary
import Spinner from '../components/shared/Spinner';     // Adjust path if necessary
import { Link } from 'react-router-dom';

const Error404Page = () => {
    const [loading, setLoading] = useState(true);

    // Define color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    // Simulate a short loading time for the page
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Shorter loading for error page
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            {/* PageHeader for the 404 page */}
            <PageHeader title="Page Not Found" activePage="404 Error" />

            <div className="container-xxl py-5" style={{ backgroundColor: colors.light }}>
                <style jsx>{`
                    .error-container {
                        text-align: center;
                        background-color: white;
                        padding: 3rem;
                        border-radius: 8px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        max-width: 700px;
                        margin: 0 auto;
                    }
                    .error-code {
                        font-size: 8rem;
                        font-weight: bold;
                        color: ${colors.primary};
                        line-height: 1;
                        margin-bottom: 1rem;
                    }
                    .error-message {
                        font-size: 2rem;
                        color: ${colors.dark};
                        margin-bottom: 1.5rem;
                    }
                    .error-description {
                        font-size: 1.1rem;
                        color: ${colors.secondary};
                        margin-bottom: 2rem;
                    }
                    .home-button {
                        background-color: ${colors.primary};
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        border-radius: 5px;
                        font-size: 1rem;
                        font-weight: bold;
                        transition: all 0.3s ease;
                        text-decoration: none; /* Ensure no underline */
                        display: inline-block; /* For padding and hover effect */
                    }
                    .home-button:hover {
                        background-color: ${colors.dark};
                        transform: translateY(-2px);
                        color: white; /* Keep text white on hover */
                    }
                `}</style>
                <div className="container py-5">
                    <div className="error-container wow fadeInUp" data-wow-delay="0.1s">
                        <h1 className="error-code">404</h1>
                        <h2 className="error-message">Page Not Found</h2>
                        <p className="error-description">
                            Oops! It looks like the page you are looking for does not exist.
                            Perhaps you typed the address incorrectly or the page has been moved.
                        </p>
                        <Link to="/" className="home-button">
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Error404Page;

import React, { useState, useEffect } from 'react';

const Topbar = () => {
    const [contactInfo, setContactInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This is the hypothetical backend URL for your contact information.
        const backendUrl = 'http://localhost:3001/api/contact';

        const fetchContactInfo = async () => {
            try {
                const response = await fetch(backendUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setContactInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    if (isLoading) {
        return <div className="loading-bar">Loading contact info...</div>;
    }

    if (error) {
        return <div className="error-bar">Error: {error}</div>;
    }

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                    .topbar-container {
                        background-color: #4A2C2A; /* A dark coffee color */
                        color: #f7f7f7;
                        padding: 0.5rem 0;
                        font-family: 'Inter', sans-serif;
                    }

                    .topbar-content {
                        display: flex;
                        justify-content: space-between;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 1rem;
                        flex-wrap: wrap;
                    }

                    .contact-info, .social-media {
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                    }

                    .contact-info > div {
                        display: flex;
                        align-items: center;
                        margin-right: 1.5rem;
                        padding: 0.25rem 0;
                    }

                    .social-media {
                        padding: 0.25rem 0;
                    }

                    .social-media a {
                        color: #f7f7f7;
                        margin-left: 0.5rem;
                        transition: color 0.3s;
                    }

                    .social-media a:hover {
                        color: #D2B48C; /* A lighter color for hover effect */
                    }

                    .fa {
                        margin-right: 0.5rem;
                    }

                    /* Hide contact info and social media on small screens */
                    @media (max-width: 991px) {
                        .topbar-container {
                            display: none;
                        }
                    }
                `}
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="topbar-container">
                <div className="topbar-content">
                    <div className="contact-info">
                        <div>
                            <span className="fa fa-phone-alt"></span>
                            <span>{contactInfo.phone}</span>
                        </div>
                        <div>
                            <span className="far fa-envelope"></span>
                            <span>{contactInfo.email}</span>
                        </div>
                    </div>
                    <div className="social-media">
                        <span>Follow Us:</span>
                        {contactInfo.socials.map((social, index) => (
                            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                                <i className={`fab fa-${social.icon}`}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Topbar;

import React, { useState, useEffect } from 'react';

// Reusable Feature Card Component
const FeatureCard = ({ iconClass, title, delay }) => (
    <div className="col-md-6 wow fadeIn" data-wow-delay={delay}>
        <div className="text-center rounded py-5 px-4" style={{ boxShadow: '0 0 45px rgba(0,0,0,.08)' }}>
            <div className="btn-square bg-light rounded-circle mx-auto mb-4" style={{ width: '90px', height: '90px' }}>
                <i className={`fa ${iconClass} fa-3x text-primary`}></i>
            </div>
            <h4 className="mb-0">{title}</h4>
        </div>
    </div>
);

// Main Component for the section
const WhyChooseUs = () => {
    const [features, setFeatures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/why-choose-us-features');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFeatures(data);
            } catch (err) {
                console.error("Failed to fetch features:", err);
                setError("Failed to load features. Please check the server connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    if (isLoading) {
        return (
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center w-full">
                        <p className="text-xl">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center w-full">
                        <p className="text-xl text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    {/* Left Column - Main Content */}
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                        <p className="fs-5 fw-bold text-primary">Why Choose Our Brew!</p>
                        <h1 className="display-5 mb-4">Reasons Our Coffee Stands Out!</h1>
                        <p className="mb-4">From bean to cup, every step is a labor of love. We source the finest beans, roast them to perfection, and pour our passion into every drink, ensuring a rich and authentic coffee experience.</p>
                        <a className="btn btn-primary py-3 px-4" href="#">Discover Our Story</a>
                    </div>

                    {/* Right Column - Feature Cards */}
                    <div className="col-lg-6">
                        <div className="row g-4">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={feature.id}
                                    iconClass={feature.icon_class}
                                    title={feature.feature_title}
                                    delay={`${(index * 0.2) + 0.3}s`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;

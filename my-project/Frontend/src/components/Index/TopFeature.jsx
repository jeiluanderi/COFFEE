import React, { useState, useEffect } from 'react';

// Reusable components (no changes needed here)
const FeatureCard = ({ iconClass, title, description, delay }) => (
    <div className="col-lg-4 wow fadeIn" data-wow-delay={delay}>
        <div className="bg-white shadow d-flex align-items-center h-100 px-5" style={{ minHeight: '160px' }}>
            <div className="d-flex">
                <div className="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                    <i className={iconClass}></i>
                </div>
                <div className="ps-3">
                    <h4>{title}</h4>
                    <span>{description}</span>
                </div>
            </div>
        </div>
    </div>
);

const TopFeature = () => {
    const [features, setFeatures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                // Fetch data from the new backend API endpoint
                const response = await fetch('http://localhost:3001/api/features');
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
            <div className="container-fluid top-feature py-5 pt-lg-0">
                <div className="container py-5 pt-lg-0">
                    <div className="row gx-0">
                        <div className="text-center w-full">
                            <p className="text-xl">Loading features...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid top-feature py-5 pt-lg-0">
                <div className="container py-5 pt-lg-0">
                    <div className="row gx-0">
                        <div className="text-center w-full">
                            <p className="text-xl text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid top-feature py-5 pt-lg-0">
            <div className="container py-5 pt-lg-0">
                <div className="row gx-0">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.id}
                            iconClass={feature.icon_class}
                            title={feature.feature_title}
                            description={feature.feature_description}
                            delay={`${(index * 0.2) + 0.1}s`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopFeature;

import React from 'react';

// Data for the feature cards
const featureData = [
    {
        iconClass: 'fa-check',
        title: 'Freshly Roasted',
        delay: '0.3s'
    },
    {
        iconClass: 'fa-users',
        title: 'Expert Baristas',
        delay: '0.5s'
    },
    {
        iconClass: 'fa-tools',
        title: 'Handcrafted Drinks',
        delay: '0.7s'
    },
];

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
                            {featureData.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    iconClass={feature.iconClass}
                                    title={feature.title}
                                    delay={feature.delay}
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
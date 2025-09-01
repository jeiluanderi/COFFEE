import React from 'react';

const featureData = [
    {
        iconClass: 'fa fa-wifi text-primary',
        title: 'Free WiFi',
        description: 'Stay connected while you sip on your favorite brew.',
        delay: '0.1s'
    },
    {
        iconClass: 'fa fa-mug-hot text-primary',
        title: 'Cozy Atmosphere',
        description: 'A perfect place to relax, work, or meet friends.',
        delay: '0.3s'
    },
    {
        iconClass: 'fa fa-coffee text-primary',
        title: 'Premium Beans',
        description: 'Enjoy high-quality, ethically sourced coffee.',
        delay: '0.5s'
    }
];

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
    return (
        <div className="container-fluid top-feature py-5 pt-lg-0">
            <div className="container py-5 pt-lg-0">
                <div className="row gx-0">
                    {featureData.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            iconClass={feature.iconClass}
                            title={feature.title}
                            description={feature.description}
                            delay={feature.delay}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopFeature;
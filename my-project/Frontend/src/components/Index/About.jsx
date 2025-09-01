import React from 'react';
import img from "../../assets/img/worldcoffee.jpg"
// Reusable components (no changes needed here)
const ExperienceBlock = ({ years, text }) => (
    <>
        <h1 className="display-1 text-primary mb-0">{years}</h1>
        <p className="text-primary mb-4">{text}</p>
    </>
);

const AboutContent = ({ title, description, buttonText }) => (
    <>
        <h1 className="display-5 mb-4">{title}</h1>
        <p className="mb-4">{description}</p>
        <a className="btn btn-primary py-3 px-4" href="">{buttonText}</a>
    </>
);

const FeatureListItem = ({ iconClass, title, description }) => (
    <div className="col-12 col-sm-6 col-lg-12">
        <div className="border-start ps-4">
            <i className={`fa ${iconClass} fa-3x text-primary mb-3`}></i>
            <h4 className="mb-3">{title}</h4>
            <span>{description}</span>
        </div>
    </div>
);

// Data for the feature list (updated for a coffee theme)
const features = [
    {
        iconClass: 'fa-award',
        title: 'Award-Winning Coffee',
        description: 'Our beans are recognized for their rich flavor and quality.'
    },
    {
        iconClass: 'fa-users',
        title: 'Passionate Baristas',
        description: 'Our team is dedicated to crafting the perfect cup for you.'
    }
];

// Main Component (with updated content and image path)
const AboutSection = () => {
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5 align-items-end">
                    {/* Image Column */}
                    <div className="col-lg-3 col-md-5 wow fadeInUp" data-wow-delay="0.1s">
                        {/* The image path needs to be updated to a coffee-themed image */}
                        <img className="img-fluid rounded" data-wow-delay="0.1s" src={img} alt="About our coffee shop" />
                    </div>

                    {/* Content Column */}
                    <div className="col-lg-6 col-md-7 wow fadeInUp" data-wow-delay="0.3s">
                        <ExperienceBlock years="10" text="Years of Roasting" />
                        <AboutContent
                            title="Serving the Community with the Perfect Brew"
                            description="For a decade, we've been dedicated to the art of coffee roasting and brewing. Our mission is to provide an exceptional coffee experience, sourcing the finest beans and sharing our passion with every cup. We believe in quality, community, and the perfect morning ritual."
                            buttonText="Our Story"
                        />
                    </div>

                    {/* Features Column */}
                    <div className="col-lg-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="row g-5">
                            {features.map((feature, index) => (
                                <FeatureListItem
                                    key={index}
                                    iconClass={feature.iconClass}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
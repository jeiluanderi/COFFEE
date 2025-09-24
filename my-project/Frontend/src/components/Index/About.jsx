import React, { useState, useEffect } from 'react';

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

// Main Component (with updated content and image path)
const AboutSection = () => {
    const [aboutData, setAboutData] = useState(null);
    const [features, setFeatures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the main about page content
                const aboutResponse = await fetch('http://localhost:3001/api/about');
                if (!aboutResponse.ok) {
                    throw new Error('Failed to fetch about data');
                }
                const aboutResult = await aboutResponse.json();
                setAboutData(aboutResult.about);
                setFeatures(aboutResult.features);

            } catch (err) {
                console.error("Error fetching about data:", err);
                setError("Failed to load about section. Please check the server connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="container-xxl py-5">
                <div className="container text-center">
                    <p className="text-xl text-dark">Loading about section...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-xxl py-5">
                <div className="container text-center">
                    <p className="text-xl text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5 align-items-end">
                    {/* Image Column */}
                    <div className="col-lg-3 col-md-5 wow fadeInUp" data-wow-delay="0.1s">
                        <img className="img-fluid rounded" data-wow-delay="0.1s" src={aboutData.image_url} alt="About our coffee shop" />
                    </div>

                    {/* Content Column */}
                    <div className="col-lg-6 col-md-7 wow fadeInUp" data-wow-delay="0.3s">
                        <ExperienceBlock years={aboutData.years_of_experience} text="Years of Roasting" />
                        <AboutContent
                            title={aboutData.about_title}
                            description={aboutData.about_description}
                            buttonText={aboutData.button_text}
                        />
                    </div>

                    {/* Features Column */}
                    <div className="col-lg-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="row g-5">
                            {features.map((feature, index) => (
                                <FeatureListItem
                                    key={index}
                                    iconClass={feature.icon_class}
                                    title={feature.feature_title}
                                    description={feature.feature_description}
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

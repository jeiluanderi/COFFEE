import React from 'react';
import HeroSlidesAdmin from '../components/HeroSlidesAdmin';
import ServicesAdmin from '../components/ServicesAdmin';
import TestimonialsAdmin from '../components/TestimonialsAdmin';
import FactsAdmin from '../components/FactsAdmin';
import './content.css'; // Assuming you have this CSS file

const ContentManagementPage = () => {
    return (
        <div className="content-management-page">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Content Dashboard</h1>
            <p className="text-gray-600 mb-8">
                Here you can manage all the dynamic content for your website's main pages.
            </p>

            <div className="content-dashboard-grid">
                {/* Hero Slides Card */}
                <div className="content-card">
                    <h2 className="content-card-title">Hero Slides</h2>
                    <p className="content-card-description">
                        Manage the images and text for the homepage slideshow.
                    </p>
                    <HeroSlidesAdmin />
                </div>

                {/* Testimonials Card */}
                <div className="content-card">
                    <h2 className="content-card-title">Testimonials</h2>
                    <p className="content-card-description">
                        Add, edit, or remove customer reviews.
                    </p>
                    <TestimonialsAdmin />
                </div>

                {/* Services Card */}
                <div className="content-card">
                    <h2 className="content-card-title">Services</h2>
                    <p className="content-card-description">
                        Update the list of services and their descriptions.
                    </p>
                    <ServicesAdmin />
                </div>

                {/* Facts Card */}
                <div className="content-card">
                    <h2 className="content-card-title">Key Facts</h2>
                    <p className="content-card-description">
                        Change the numbers and labels for the animated facts counter.
                    </p>
                    <FactsAdmin />
                </div>
            </div>
        </div>
    );
};

export default ContentManagementPage;
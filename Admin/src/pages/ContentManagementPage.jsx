import React from 'react';
// IMPORT the hook to access the global refresh function

// Import the component responsible for CRUD on the header image URL
import PageHeaderAdminCard from '../components/PageHeaderAdminCard'; 
// Assuming other admin components are in '../components'
import HeroSlidesAdmin from '../components/HeroSlidesAdmin';
import ServicesAdmin from '../components/ServicesAdmin';
import TestimonialsAdmin from '../components/TestimonialsAdmin';
import FactsAdmin from '../components/FactsAdmin';
import './content.css';

const ContentManagementPage = () => {
    // 1. Get the crucial refresh function from the global context
    // This hook assumes you have correctly implemented the PageSettingsProvider.jsx file.
   

    return (
        <div className="content-management-page p-6 md:p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Content Dashboard</h1>
            <p className="text-gray-600 mb-8">
                Here you can manage all the dynamic content for your website's main pages.
            </p>

            <div className="content-dashboard-grid">
                
                {/* =========================================
                NEW CARD: Page Headers & Images (Integrated) 🚀
                =========================================
                */}
                <div className="content-card full-width-card"> 
                    <h2 className="content-card-title">Page Headers & Backgrounds</h2>
                    <p className="content-card-description">
                        Manage the central background image URL used in the main page headers.
                    </p>
                    {/* 2. PASS THE REFRESH FUNCTION TO THE ADMIN CARD */}
                    <PageHeaderAdminCard  />
                </div>
                {/* =========================================
                END NEW CARD
                =========================================
                */}

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
                        Review customer reviews.
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
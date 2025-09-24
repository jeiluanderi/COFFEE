import React, { useState, useEffect } from 'react';
// import PageHeader from '../components/Shared/PageHeader'; // Assuming PageHeader is in this path
import Spinner from '../components/Shared/Spinner';
import TestimonialSection from '../components/Testimonial/TestimonialSection';

const TestimonialPage = () => {
    const [loading, setLoading] = useState(true);

    // Simulate a data fetch with useEffect
    useEffect(() => {
        // This could be your API call
        const timer = setTimeout(() => {
            setLoading(false); // Once data is fetched, set loading to false
        }, 150);

        // Cleanup function to clear the timer
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                // Conditionally render the Spinner when loading is true
                <Spinner />
            ) : (
                // Render the page content when loading is false
                <>
                    {/* PageHeader for the Testimonials page with relevant props */}
                    {/* <PageHeader title="Testimonials" activePage="Testimonials" /> */}
                    <TestimonialSection />
                </>
            )}
        </>
    );
};

export default TestimonialPage;

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/About/PageHeader';
import AboutSection from '../components/About/AboutSection';
import FactCounter from '../components/FactCounter/FactCounter';
import TeamSection from '../components/About/TeamSection';
import Spinner from '../components/shared/Spinner';

function AboutPage() {
    // 1. Create a state variable to track the loading status
    const [loading, setLoading] = useState(true);

    // 2. Use useEffect to handle the loading logic
    useEffect(() => {
        // Simulate a page load or data fetch.
        // In a real app, this is where you'd put your API call.
        const timer = setTimeout(() => {
            setLoading(false); // Hide the spinner after 1.5 seconds
        }, 150);

        // Cleanup function to prevent memory leaks if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                // 3. Conditionally render the Spinner if 'loading' is true
                <Spinner />
            ) : (
                // 3. Render the rest of the page content when 'loading' is false
                <>
                    <PageHeader />
                    <AboutSection />
                    <FactCounter />
                    <TeamSection />
                </>
            )}
        </>
    );
}

export default AboutPage;
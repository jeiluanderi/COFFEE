import React, { useState, useEffect } from 'react'; // <-- This is the missing part
import PageHeader from '../components/events/PageHeader';
import EventsSection from '../components/events/EventsSection';
import WhyUsSection from '../components/events/WhyUsSection';
import FactCounter from '../components/FactCounter/FactCounter';
import Spinner from '../components/shared/Spinner';

function Events() {
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
                    <EventsSection />
                    {/* <WhyUsSection /> */}
                    {/* <FactCounter /> */}
                </>
            )}
        </>
    );
}

export default Events;
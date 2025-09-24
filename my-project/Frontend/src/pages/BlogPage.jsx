import React, { useState, useEffect } from 'react';
// import PageHeader from '../components/Shared/PageHeader';
import Spinner from '../components/Shared/Spinner'; // Import the new Spinner component
import BlogSection from '../components/Blog/BlogSection';

const Blog = () => {
    const [loading, setLoading] = useState(true);

    // Simulate a data fetch with useEffect
    useEffect(() => {
        // This could be your API call
        const timer = setTimeout(() => {
            setLoading(false); // Once data is fetched, set loading to false
        }, 150); // Wait 1.5 seconds

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
                    {/* <PageHeader /> */}
                    <BlogSection />
                </>
            )}
        </>
    );
};

export default Blog;
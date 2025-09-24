import React, { useState, useEffect } from 'react';
// import PageHeader from '../components/Shared/PageHeader';
import Spinner from '../components/Shared/Spinner';
import ContactSection from '../components/Contact/ContactSection';

const ContactPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulates the initial page load spinner from the original template
        const timer = setTimeout(() => {
            setLoading(false);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {/* <PageHeader title="Contact Us" activePage="Contact" /> */}
                    <ContactSection />
                </>
            )}
        </>
    );
};

export default ContactPage;
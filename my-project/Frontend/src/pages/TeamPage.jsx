import React, { useState, useEffect } from 'react';
import PageHeader from '../components/Team/PageHeader';
import TeamSection from '../components/Team/TeamSection';
import Spinner from '../components/shared/Spinner';


function TeamPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    <PageHeader title="Our Team" activePage="Our Team" />
                    <TeamSection />
                    {/* <TeamMember /> */}
                </>
            )}
        </>
    );
}

export default TeamPage;
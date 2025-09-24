// src/components/FactCounter/FactCounter.jsx
import React, { useState, useEffect } from 'react';
import CounterItem from './CounterItem';
// import Spinner from '../shared/Spinner'; 

const FactCounter = () => {
    const [counterData, setCounterData] = useState([]);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch counter data and the Cloudinary URL from your API
                const [factsResponse, bgResponse] = await Promise.all([
                    fetch('http://localhost:3001/api/facts'),
                    fetch('http://localhost:3001/api/settings/fact_counter_bg_url')
                ]);
                if (!factsResponse.ok || !bgResponse.ok) {
                    throw new Error('One or more API requests failed.');
                }

                const factsData = await factsResponse.json();
                const bgData = await bgResponse.json();

                setCounterData(factsData);
                // Set the state with the full Cloudinary URL
                setBackgroundImageUrl(bgData.value);

            } catch (error) {
                setError(error);
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return
        // <Spinner />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Use the dynamic URL fetched from the database
    const backgroundStyle = {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: '500px auto',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
    };

    const overlayStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    };

    return (
        <div className="container-fluid facts my-5 py-5" style={backgroundStyle}>
            <div className="container py-5" style={overlayStyle}>
                <div className="row g-5">
                    {counterData.map((item, index) => (
                        <CounterItem
                            key={index}
                            number={item.number}
                            text={item.text}
                            delay={item.delay || `${(index * 0.2) + 0.1}s`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FactCounter;
// src/components/FactCounter/FactCounter.jsx
import React from 'react';
import CounterItem from './CounterItem';
import coff from '../../assets/img/coff.jpg'

const counterData = [
    { number: 5000, text: 'Happy Customers', delay: '0.1s' },
    { number: 10, text: 'Years of Experience', delay: '0.3s' },
    { number: 12, text: 'Unique Blends', delay: '0.5s' },
    { number: 250, text: 'Cups Served Daily', delay: '0.7s' },
];

const FactCounter = () => {
    const backgroundStyle = {
        // You'll need to place a coffee-themed image with this name in your public/img directory
        backgroundImage: `url(${coff})`,
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
                            delay={item.delay}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FactCounter;
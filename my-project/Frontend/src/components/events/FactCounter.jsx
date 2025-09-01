import React from 'react';

const counterData = [
    { number: '1234', text: 'Happy Clients', delay: '0.1s' },
    { number: '1234', text: 'Garden Completed', delay: '0.3s' },
    { number: '1234', text: 'Dedicated Staff', delay: '0.5s' },
    { number: '1234', text: 'Awards Achieved', delay: '0.7s' },
];

const CounterItem = ({ number, text, delay }) => (
    <div className="col-sm-6 col-lg-3 text-center wow fadeIn" data-wow-delay={delay}>
        <h1 className="display-4 text-white" data-toggle="counter-up">{number}</h1>
        <span className="fs-5 fw-semi-bold text-light">{text}</span>
    </div>
);

const FactCounter = () => {
    const backgroundStyle = {
        backgroundImage: `url('img/carousel-1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
    };

    const overlayStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha (0.5) for desired darkness
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
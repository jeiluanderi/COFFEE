// src/components/FactCounter/CounterItem.jsx
import React from 'react';
import useCounter from '../../hooks/useCounter';

const CounterItem = ({ number, text, delay }) => {
    // Convert the number prop to an integer
    const endNumber = parseInt(number, 10);

    // Use the custom hook to animate the count
    const animatedNumber = useCounter(endNumber, 2000); // 2000ms duration

    return (
        <div className="col-sm-6 col-lg-3 text-center wow fadeIn" data-wow-delay={delay}>
            <h1 className="display-4 text-white">{animatedNumber}</h1>
            <span className="fs-5 fw-semi-bold text-light">{text}</span>
        </div>
    );
};

export default CounterItem;
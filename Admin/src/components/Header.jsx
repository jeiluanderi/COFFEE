import React, { useState, useEffect } from 'react';
import '../index.css';

const Header = ({ orderCount }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [typedMessage, setTypedMessage] = useState('');

    // Function to get a dynamic message based on order count
    const getDynamicMessage = (count) => {
        if (count === 0) {
            return "No orders yet. Let's get started!";
        } else if (count > 0 && count <= 5) {
            return `You have ${count} orders. Keep up the good work!`;
        } else {
            return " Nice! We have a lot of orders 🙂";
        }
    };

    // The full message to be typed out
    const fullMessage = getDynamicMessage(orderCount);

    // Effect to handle the typing animation
    useEffect(() => {
        let charIndex = 0;
        setTypedMessage(''); // Ensure the message is reset at the start of the effect

        const typingInterval = setInterval(() => {
            if (charIndex <= fullMessage.length) {
                setTypedMessage(fullMessage.substring(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50); // Adjust this value to control typing speed (in milliseconds)

        // Cleanup function to clear the interval when the component unmounts or dependencies change
        return () => clearInterval(typingInterval);
    }, [fullMessage]); // Re-run the effect whenever the full message changes

    // Effect to handle the current date
    useEffect(() => {
        const formatDate = () => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);
            setCurrentDate(formattedDate);
        };
        formatDate();
    }, []);

    return (
        <header className="main-header">
            <h2>{typedMessage}</h2>
            <span className="date">{currentDate}</span>
        </header>
    );
};

export default Header;
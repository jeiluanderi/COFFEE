import React from 'react';

const BackToTopButton = () => {
    return (
        <>
            {/* Inline style block for the CSS rules */}
            {/* In a larger application, these styles would typically be in a separate .css file */}
            <style>
                {`
                .gardener-back-to-top {
                    /* Coffee-themed background color */
                    background-color: #A16207; /* A warm amber/brown */
                    /* Text color for the icon */
                    color: #fff; /* White for contrast */
                    /* Fixed positioning for bottom-right corner */
                    position: fixed;
                    bottom: 1rem; /* Adjust as needed for spacing from bottom */
                    right: 1rem; /* Adjust as needed for spacing from right */
                    z-index: 50; /* Ensure it stays on top */
                    /* Size of the button */
                    width: 3rem; /* Roughly 48px, similar to p-3 with a small icon */
                    height: 3rem; /* Roughly 48px */
                    /* Center the icon using flexbox */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    /* Fully rounded shape */
                    border-radius: 50%;
                    /* Subtle shadow for depth */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                    /* Smooth transition for hover effects */
                    transition: all 0.3s ease-in-out;
                    /* Remove default button/link styling */
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                }

                .gardener-back-to-top:hover {
                    /* Darker background on hover */
                    background-color: #8C4D00; /* Slightly darker brown */
                    /* Lift effect on hover */
                    transform: translateY(-4px);
                }

                .gardener-back-to-top i {
                    /* Ensure the icon's color inherits from the parent */
                    color: inherit;
                    /* Basic icon sizing, assuming bi bi-arrow-up provides some size */
                    font-size: 1.25rem; /* Adjust if your icon font needs specific sizing */
                }
                `}
            </style>
            <a
                href="#"
                // The 'gardener-back-to-top' class will now apply the custom CSS styles
                className="btn btn-square rounded-circle gardener-back-to-top"
                aria-label="Back to top"
            >
                <i className="bi bi-arrow-up"></i>
            </a>
        </>
    );
};

export default BackToTopButton;

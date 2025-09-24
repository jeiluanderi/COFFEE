import React, { useState, useEffect } from "react";
import axios from 'axios';

export const Hero = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/hero-slides');

                // Map the data from the backend's snake_case to the frontend's camelCase
                const formattedSlides = response.data.map(slide => ({
                    id: slide.id,
                    imageSrc: slide.image_src,
                    title: slide.title,
                    buttonText: slide.button_text,
                    buttonHref: slide.button_href,
                }));
                
                setSlides(formattedSlides);
                
            } catch (err) {
                console.error("Error fetching hero slides:", err);
                setError("Failed to load hero slides. Please check the backend.");
            } finally {
                // This is the crucial missing piece.
                // It will run regardless of success or failure.
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Conditional rendering based on the component's state
    if (loading) {
        return <div className="loading-state">Loading...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    if (slides.length === 0) {
        return <div className="no-slides">No hero slides found.</div>;
    }

    // Main component render
    return (
        <div className="container-fluid p-0 wow fadeIn" data-wow-delay="0.1s">
            <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {slides.map((slide, index) => (
                        <div
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                            key={slide.id}
                        >
                            <img className="w-100" src={slide.imageSrc} alt={slide.title} />
                            <div className="carousel-caption">
                                <div className="container">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-8">
                                            <h1 className="display-1 text-white mb-5 animated slideInDown">
                                                {slide.title}
                                            </h1>
                                            <a href={slide.buttonHref} className="btn btn-primary py-sm-3 px-sm-4">
                                                {slide.buttonText}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Carousel Controls */}
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#header-carousel"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#header-carousel"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'; 
import TestimonialSubmissionModal from '../TestimonialSubmissionModal';

// This is the correct way to get the environment variable for Vite.
// You must have a .env file with VITE_API_URL=http://localhost:3001
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const TestimonialSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showAllTestimonials, setShowAllTestimonials] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/testimonials`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTestimonials(data.map(t => ({
                ...t,
                // Use t.customer_name instead of t.client_name for placeholder image
                imageSrc: t.image_url || `https://placehold.co/120x120/E8E2D7/4A2C2A?text=${(t.customer_name || '').charAt(0)}`,
                id: t.id // Ensure ID exists for the key prop
            })));
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
            setTestimonials([]); // Set to an empty array on failure
        }
    };

    useEffect(() => {
        fetchTestimonials();

        const token = localStorage.getItem('token'); 
        setIsLoggedIn(!!token); 
    }, []);

    useEffect(() => {
        if (testimonials.length > 0 && !showAllTestimonials) {
            const timer = setTimeout(() => {
                const nextSlide = (currentSlide + 1) % testimonials.length;
                setCurrentSlide(nextSlide);
            }, 5000); // Change slide every 5 seconds
            return () => clearTimeout(timer);
        }
    }, [currentSlide, testimonials, showAllTestimonials]);

    const handleNewTestimonialSubmitted = () => {
        fetchTestimonials();
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const colors = {
        primary: '#8B4513',
        secondary: '#6F4E37',
        light: '#F8F5EB',
        dark: '#36220B'
    };

    return (
        <div className="container-xxl py-5">
            <style jsx>{`
                .testimonial-item {
                    text-align: center;
                    background-color: white;
                    border-radius: 10px;
                    padding: 2.5rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                    margin: 0 15px;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .testimonial-item img {
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 50%;
                    border: 4px solid ${colors.primary};
                    margin-bottom: 1.5rem;
                }
                .testimonial-item h4 {
                    color: ${colors.dark};
                    margin-bottom: 0.25rem;
                }
                .testimonial-item span {
                    color: ${colors.secondary};
                    font-style: italic;
                }
                .testimonial-item p {
                    color: ${colors.dark};
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                .custom-arrow {
                    background-color: ${colors.light};
                    color: ${colors.secondary};
                    border: 1px solid ${colors.secondary};
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                    border-radius: 50%;
                }
                .custom-arrow:hover {
                    background-color: ${colors.primary};
                    color: white;
                    border-color: ${colors.primary};
                    transform: scale(1.1);
                }
                .testimonial-slider-container {
                    overflow: hidden;
                    position: relative;
                }
                .testimonial-slide-content {
                    display: flex;
                    transition: transform 0.5s ease-in-out;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease-in-out;
                }
                .modal-content {
                    background-color: ${colors.light};
                    border-radius: 15px;
                    padding: 2.5rem;
                    width: 90%;
                    max-width: 800px;
                    max-height: 80%;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    animation: slideUp 0.3s ease-in-out;
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: ${colors.dark};
                }
                .modal-testimonial-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem 0;
                    border-bottom: 1px solid ${colors.secondary};
                }
                .modal-testimonial-item:last-child {
                    border-bottom: none;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
            <div className="container">
                <div className="row g-5">
                    {/* Left Column - Heading and Button */}
                    <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
                        <p className="fs-5 fw-bold text-primary">Customer Stories</p>
                        <h1 className="display-5 mb-5">What Our Guests Love About Us!</h1>
                        <p className="mb-4">Hear directly from our valued customers about their BrewHaven Coffee experience. Their joy is our greatest reward.</p>

                        <div className="d-flex flex-wrap gap-2">
                             <button
                                 className="btn py-3 px-4"
                                 onClick={() => setShowAllTestimonials(true)}
                                 style={{ backgroundColor: colors.primary, color: 'white' }}
                             >
                                 Read All Testimonials
                             </button>
                             {isLoggedIn && (
                                 <button
                                     className="btn py-3 px-4"
                                     onClick={() => setIsSubmissionModalOpen(true)}
                                     style={{ backgroundColor: colors.light, color: colors.secondary, border: `1px solid ${colors.secondary}` }}
                                 >
                                     <PlusCircle size={20} className="me-2" />
                                     Add Your Testimonial
                                 </button>
                             )}
                        </div>
                    </div>

                    {/* Right Column - Slider with Custom Controls */}
                    <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="testimonial-slider-container">
                            <div
                                className="testimonial-slide-content"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {testimonials.length > 0 ? (
                                        testimonials.map((testimonial) => (
                                            <div key={testimonial.id} style={{ minWidth: '100%' }}>
                                                <div className="testimonial-item">
                                                    {/* Changed testimonial.clientName to testimonial.customer_name */}
                                                    <img className="img-fluid" src={testimonial.imageSrc} alt={testimonial.customer_name} />
                                                    <p className="fs-5">"{testimonial.quote}"</p> {/* Added quotes around quote */}
                                                    {/* Changed testimonial.clientName to testimonial.customer_name */}
                                                    <h4>{testimonial.customer_name}</h4>
                                                    <span>{testimonial.profession}</span>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                        <div style={{ minWidth: '100%' }}>
                                            <p className="text-center">No testimonials found. Be the first to add one!</p>
                                        </div>
                                )}
                            </div>
                        </div>
                        {/* Custom Navigation Buttons below the slider */}
                        <div className="d-flex justify-content-center mt-4">
                            <button
                                className="btn me-3 custom-arrow"
                                onClick={prevSlide}
                                aria-label="Previous Testimonial"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                className="btn custom-arrow"
                                onClick={nextSlide}
                                aria-label="Next Testimonial"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Testimonials Modal */}
            {showAllTestimonials && (
                <div className="modal-overlay" onClick={() => setShowAllTestimonials(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowAllTestimonials(false)}>&times;</button>
                        <h2 className="text-center display-5 mb-4" style={{ color: colors.dark }}>All Testimonials</h2>
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="modal-testimonial-item">
                                {/* Changed testimonial.clientName to testimonial.customer_name */}
                                <img src={testimonial.imageSrc} alt={testimonial.customer_name} style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }} />
                                <p className="text-center" style={{ color: colors.dark, fontSize: '1rem', lineHeight: '1.5' }}>"{testimonial.quote}"</p> {/* Added quotes around quote */}
                                {/* Changed testimonial.clientName to testimonial.customer_name */}
                                <h4 className="mt-2" style={{ color: colors.dark, fontSize: '1.2rem' }}>{testimonial.customer_name}</h4>
                                <span style={{ color: colors.secondary, fontStyle: 'italic' }}>{testimonial.profession}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* New Testimonial Submission Modal */}
            <TestimonialSubmissionModal
                isOpen={isSubmissionModalOpen}
                onClose={() => setIsSubmissionModalOpen(false)}
                onSubmitted={handleNewTestimonialSubmitted}
            />
        </div>
    );
};

export default TestimonialSection;
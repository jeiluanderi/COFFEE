import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import local images for the testimonial items (user will replace these)
import testimonialImg1 from '../../assets/img/customer-1.jpg'; // Placeholder for happy customer
import testimonialImg2 from '../../assets/img/customer-2.jpg'; // Placeholder for another happy customer
import testimonialImg3 from '../../assets/img/customer-3.jpg'; // Added another testimonial image
import testimonialImg4 from '../../assets/img/customer-4.jpg'; // Added another testimonial image

// Data for the testimonial items
const testimonialsData = [
    {
        imageSrc: testimonialImg1,
        quote: 'COFFEE has truly mastered the art of brewing! Every cup is a delightful experience, and their cozy atmosphere makes it my favorite spot to unwind. Highly recommend!',
        clientName: 'Sarah J.',
        profession: 'Freelance Designer',
    },
    {
        imageSrc: testimonialImg2,
        quote: 'The pastries here are out of this world, and the latte art is simply stunning. It\'s more than just a coffee shop; it\'s a daily dose of joy and creativity!',
        clientName: 'Liya T.',
        profession: 'Local Artist',
    },
    {
        imageSrc: testimonialImg3,
        quote: 'I count on COFFEE for my morning pick-me-up. Their cold brew is incredibly smooth, and the staff are always so friendly and welcoming. A true gem!',
        clientName: 'Jessica L.',
        profession: 'Marketing Manager',
    },
    {
        imageSrc: testimonialImg4,
        quote: 'As a coffee connoisseur, I\'m always looking for quality. BrewHaven\'s single-origin roasts are exceptional, and their knowledge of coffee is impressive. Five stars!',
        clientName: 'Dina K.',
        profession: 'Coffee Enthusiast',
    },
];

const TestimonialSection = () => {
    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, // Hide built-in arrows
        autoplay: true, // Auto-play the slider
        autoplaySpeed: 5000, // Change slide every 5 seconds
    };

    // Define colors for consistency
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    return (
        <div className="container-xxl py-5">
            {/* Internal CSS for the testimonial items and slider controls */}
            <style jsx>{`
                .testimonial-item {
                    text-align: center;
                    background-color: white; /* White background for the testimonial box */
                    border-radius: 10px;
                    padding: 2.5rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08); /* Soft shadow */
                    margin: 0 15px; /* Spacing between slider items if slidesToShow > 1 */
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .testimonial-item img {
                    width: 120px; /* Fixed width for circular images */
                    height: 120px; /* Fixed height for circular images */
                    object-fit: cover;
                    border-radius: 50%; /* Make images circular */
                    border: 4px solid ${colors.primary}; /* Primary color border */
                    margin-bottom: 1.5rem;
                }
                .testimonial-item h4 {
                    color: ${colors.dark}; /* Dark client name */
                    margin-bottom: 0.25rem;
                }
                .testimonial-item span {
                    color: ${colors.secondary}; /* Secondary color for profession */
                    font-style: italic;
                }
                .testimonial-item p {
                    color: ${colors.dark}; /* Dark text for quote */
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }

                /* Custom Arrow Styling */
                .custom-arrow {
                    background-color: ${colors.light}; /* Cream background */
                    color: ${colors.secondary}; /* Coffee brown icon */
                    border: 1px solid ${colors.secondary}; /* Coffee brown border */
                    width: 50px; /* Size of the button */
                    height: 50px; /* Size of the button */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.3s ease; /* Smooth transition */
                }
                .custom-arrow:hover {
                    background-color: ${colors.primary}; /* Saddle brown on hover */
                    color: white; /* White icon on hover */
                    border-color: ${colors.primary};
                    transform: scale(1.1); /* Subtle zoom effect */
                }

                /* Override Slick Carousel default styles for navigation */
                .slick-slide {
                    padding: 0 10px; /* Adjust slide padding to prevent cropping */
                }
                .slick-list {
                    margin: 0 -10px; /* Counteract slide padding */
                }
            `}</style>
            <div className="container">
                <div className="row g-5">
                    {/* Left Column - Heading and Button */}
                    <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
                        <p className="fs-5 fw-bold text-primary">Customer Stories</p>
                        <h1 className="display-5 mb-5">What Our Guests Love About Us!</h1>
                        <p className="mb-4">Hear directly from our valued customers about their COFFEE experience. Their joy is our greatest reward.</p>
                        <a className="btn py-3 px-4" href="#" style={{ backgroundColor: colors.primary, color: 'white' }}>Read All Testimonials</a>
                    </div>

                    {/* Right Column - Slider with Custom Controls */}
                    <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.5s">
                        <Slider {...settings} ref={sliderRef}>
                            {testimonialsData.map((testimonial, index) => (
                                <div key={index}>
                                    <div className="testimonial-item">
                                        <img className="img-fluid" src={testimonial.imageSrc} alt={testimonial.clientName} />
                                        <p className="fs-5">{testimonial.quote}</p>
                                        <h4>{testimonial.clientName}</h4>
                                        <span>{testimonial.profession}</span>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                        {/* Custom Navigation Buttons below the slider */}
                        <div className="d-flex justify-content-center mt-4"> {/* Increased margin-top for spacing */}
                            <button
                                className="btn rounded-circle me-3 custom-arrow" // Increased me-2 to me-3
                                onClick={() => sliderRef.current.slickPrev()}
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            <button
                                className="btn rounded-circle custom-arrow"
                                onClick={() => sliderRef.current.slickNext()}
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSection;

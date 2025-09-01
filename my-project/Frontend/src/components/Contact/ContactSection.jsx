import React, { useState } from 'react';

const ContactSection = () => {
    // Define the color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send formData to your backend API here
        console.log('Contact form submitted:', formData);
        alert('Thank you for your message! We will get back to you shortly.'); // Replaced console.log with an alert for user feedback
        // Reset form after submission
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="container-xxl py-5">
            {/* Internal CSS for consistent styling */}
            <style jsx>{`
                .contact-form-container {
                    background-color: ${colors.light}; /* Creamy White background for the form box */
                    border-radius: 8px;
                    padding: 2.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .form-control {
                    border: 1px solid ${colors.secondary}; /* Coffee Brown border for inputs */
                    color: ${colors.dark}; /* Dark text in inputs */
                    background-color: white; /* White background for input fields */
                }
                .form-floating label {
                    color: ${colors.secondary}; /* Coffee Brown label text */
                }
                .form-control:focus {
                    border-color: ${colors.primary}; /* Primary color on focus */
                    box-shadow: 0 0 0 0.25rem rgba(139, 69, 19, 0.25); /* Subtle primary color shadow on focus */
                }
                .btn-primary-custom {
                    background-color: ${colors.primary}; /* Saddle Brown button */
                    border-color: ${colors.primary};
                    color: white;
                    transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
                }
                .btn-primary-custom:hover {
                    background-color: ${colors.dark}; /* Darker brown on hover */
                    border-color: ${colors.dark};
                    transform: translateY(-2px); /* Slight lift on hover */
                }
            `}</style>
            <div className="container">
                <div className="text-center mx-auto wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                    <p className="fs-5 fw-bold text-primary">Get In Touch</p>
                    <h1 className="display-5 mb-5">We'd Love To Hear From You!</h1>
                </div>
                <div className="row g-5">
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                        <div className="contact-form-container">
                            <p className="mb-4">Have questions, feedback, or just want to say hello? Fill out the form below, and our team will get back to you as soon as possible.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="name">Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subject"
                                                placeholder="Subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="subject">Subject</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                placeholder="Leave a message here"
                                                id="message"
                                                style={{ height: '100px' }}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                            <label htmlFor="message">Message</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary-custom py-3 px-4 w-100" type="submit">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s" style={{ minHeight: '450px' }}>
                        <div className="position-relative rounded overflow-hidden h-100">
                            <iframe
                                className="position-relative w-100 h-100"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.955054044033!2d-73.98774058459427!3d40.74844037932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2593f63110001%3A0xc328a9b2c8a2b5e2!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1677894572345!5m2!1sen!2sus"
                                frameBorder="0"
                                style={{ minHeight: '450px', border: 0 }}
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex="0"
                                title="COFFEE Location on Google Map"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;

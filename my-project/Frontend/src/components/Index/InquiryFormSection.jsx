import React, { useState } from 'react';
import coffeeBackground from '../../assets/img/coff.jpg';

const InquiryFormSection = () => {
    // Define color palette for consistent styling
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
        phone: '',
        subject: '', // Renamed 'service' to 'subject'
        message: ''
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Style for the background image
    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coffeeBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
    };

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        setIsError(false);
        setIsSubmitting(true);

        // Basic client-side validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setIsError(true);
            setStatusMessage('Please fill in all required fields: Name, Email, Subject, and Message.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage(data.message || 'Your inquiry has been sent successfully!');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // Clear form
            } else {
                setIsError(true);
                setStatusMessage(data.message || 'Failed to send your inquiry. Please try again.');
            }

        } catch (error) {
            console.error('Submission error:', error);
            setIsError(true);
            setStatusMessage('An unexpected error occurred. Please check your network connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid quote my-5 py-5" style={backgroundStyle}>
            <style >{`
                .form-box {
                    background-color: white;
                    border-radius: 8px;
                    padding: 2.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }
                .form-control, .form-select {
                    border: 1px solid ${colors.secondary};
                    color: ${colors.dark};
                    background-color: ${colors.light};
                }
                .form-floating label {
                    color: ${colors.secondary};
                }
                .form-control:focus, .form-select:focus {
                    border-color: ${colors.primary};
                    box-shadow: 0 0 0 0.25rem rgba(139, 69, 19, 0.25);
                }
                .submit-button {
                    background-color: ${colors.primary};
                    border-color: ${colors.primary};
                    color: white;
                    padding: 0.8rem 2.5rem;
                    border-radius: 5px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                .submit-button:hover:not(:disabled) {
                    background-color: ${colors.dark};
                    border-color: ${colors.dark};
                    transform: translateY(-2px);
                }
                .submit-button:disabled {
                    background-color: #cccccc;
                    border-color: #cccccc;
                    cursor: not-allowed;
                }
                .status-message {
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    border-radius: 5px;
                    font-weight: bold;
                    text-align: center;
                }
                .status-message.success {
                    background-color: #d4edda;
                    color: #155724;
                }
                .status-message.error {
                    background-color: #f8d7da;
                    color: #721c24;
                }
            `}</style>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="form-box wow fadeIn" data-wow-delay="0.5s">
                            <h1 className="display-5 text-center mb-5" style={{ color: colors.dark }}>Send an Inquiry</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                            />
                                            <label htmlFor="name">Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                            />
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                placeholder="Your Phone (Optional)"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                            />
                                            <label htmlFor="phone">Your Phone</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                            >
                                                <option value="" disabled>Select Subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="feedback">Product Feedback</option>
                                                <option value="partnership">Partnership</option>
                                            </select>
                                            <label htmlFor="subject">Subject</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                placeholder="Leave your message here"
                                                id="message"
                                                style={{ height: '100px' }}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                            ></textarea>
                                            <label htmlFor="message">Your Message</label>
                                        </div>
                                    </div>
                                    {statusMessage && (
                                        <div className={`col-12 status-message ${isError ? 'error' : 'success'}`}>
                                            {statusMessage}
                                        </div>
                                    )}
                                    <div className="col-12 text-center">
                                        <button className="btn submit-button" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryFormSection;
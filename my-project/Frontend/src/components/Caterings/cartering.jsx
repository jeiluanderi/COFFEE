import React from 'react';

function CateringSection() {
    // Define a color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    const formBackgroundStyle = {
        backgroundColor: colors.light, // Light cream background for the form
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' // Subtle shadow for depth
    };

    const inputStyle = {
        borderColor: colors.secondary, // Coffee brown border for inputs
        color: colors.dark, // Dark coffee brown text
    };

    const labelStyle = {
        color: colors.secondary // Coffee brown label text
    };

    const buttonStyle = {
        backgroundColor: colors.primary, // Saddle brown button
        borderColor: colors.primary,
        color: 'white'
    };

    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                    <p className="fs-5 fw-bold text-primary">Coffee Catering</p>
                    <h1 className="display-5 mb-5">Plan Your Perfect Coffee Event</h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s" style={formBackgroundStyle}>
                            <form>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input type="text" className="form-control border-0" id="fullName" placeholder="Your Name" style={inputStyle} />
                                            <label htmlFor="fullName" style={labelStyle}>Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input type="email" className="form-control border-0" id="email" placeholder="Your Email" style={inputStyle} />
                                            <label htmlFor="email" style={labelStyle}>Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input type="text" className="form-control border-0" id="mobile" placeholder="Your Mobile" style={inputStyle} />
                                            <label htmlFor="mobile" style={labelStyle}>Your Mobile</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            {/* Changed from input to select for catering type */}
                                            <select className="form-select border-0" id="eventType" style={inputStyle}>
                                                <option value="">Select Event Type</option>
                                                <option value="corporate">Corporate Event</option>
                                                <option value="private">Private Party</option>
                                                <option value="wedding">Wedding</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <label htmlFor="eventType" style={labelStyle}>Event Type</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input type="number" className="form-control border-0" id="numGuests" placeholder="Number of Guests" min="1" style={inputStyle} />
                                            <label htmlFor="numGuests" style={labelStyle}>Number of Guests</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-floating">
                                            <input type="date" className="form-control border-0" id="eventDate" placeholder="Event Date" style={inputStyle} />
                                            <label htmlFor="eventDate" style={labelStyle}>Event Date</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea className="form-control border-0" placeholder="Tell us about your catering needs..." id="message" style={{ height: '100px', ...inputStyle }}></textarea>
                                            <label htmlFor="message" style={labelStyle}>Special Requests / Details</label>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button className="btn py-3 px-4" type="submit" style={buttonStyle}>Request Catering Quote</button>
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

export default CateringSection;

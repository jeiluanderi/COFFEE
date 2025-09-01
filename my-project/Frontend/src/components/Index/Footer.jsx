import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const footerStyle = {
        backgroundColor: '#F5EFE6',
        color: '#4A2C2A'
    };

    const buttonStyle = {
        backgroundColor: '#4A2C2A',
        borderColor: '#4A2C2A'
    };

    const linkStyle = {
        color: '#4A2C2A'
    };

    const topicBoxStyle = {
        border: '1px solid rgba(74, 44, 42, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.05)'
    };

    const topicHeadingStyle = {
        color: '#4A2C2A',
        marginBottom: '1rem',
        fontWeight: 'bold'
    };

    return (
        <>
            {/* Hover styles */}
            <style>
                {`
                    .visit-hover {
                        transition: color 0.3s ease, transform 0.3s ease;
                        cursor: pointer;
                    }
                    .visit-hover:hover {
                        color: #C27A48; 
                        transform: translateX(5px);
                    }
                `}
            </style>

            <div className="container-fluid footer mt-5 py-5 wow fadeIn" data-wow-delay="0.1s" style={footerStyle}>
                <div className="container py-5">
                    <div className="row g-4 text-start">

                        {/* Visit Us */}
                        <div className="col-lg-3 col-md-6">
                            <div style={topicBoxStyle}>
                                <h4 style={topicHeadingStyle}>Visit Us</h4>
                                <p className="mb-2 visit-hover">
                                    <i className="fa fa-map-marker-alt me-3"></i>
                                    456 Brew Street, Cityville, USA
                                </p>
                                <p className="mb-2 visit-hover">
                                    <i className="fa fa-phone-alt me-3"></i>
                                    +1 (555) 123-4567
                                </p>
                                <p className="mb-2 visit-hover">
                                    <i className="fa fa-envelope me-3"></i>
                                    info@COFFEE.com
                                </p>
                                <div className="d-flex pt-2">
                                    <a className="btn btn-square btn-outline-dark rounded-circle me-2" href="#"><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square btn-outline-dark rounded-circle me-2" href="#"><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square btn-outline-dark rounded-circle me-2" href="#"><i className="fab fa-instagram"></i></a>
                                    <a className="btn btn-square btn-outline-dark rounded-circle me-2" href="#"><i className="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>

                        {/* Our Menu */}
                        <div className="col-lg-3 col-md-6">
                            <div style={topicBoxStyle}>
                                <h4 style={topicHeadingStyle}>Our Menu</h4>
                                <Link className="btn btn-link d-block text-start" to="/menu" style={linkStyle}>Espresso & Coffee</Link>
                                <Link className="btn btn-link d-block text-start" to="/menu" style={linkStyle}>Specialty Drinks</Link>
                                <Link className="btn btn-link d-block text-start" to="/menu" style={linkStyle}>Teas & Cold Brews</Link>
                                <Link className="btn btn-link d-block text-start" to="/menu" style={linkStyle}>Pastries & Bites</Link>
                                <Link className="btn btn-link d-block text-start" to="/menu" style={linkStyle}>Merchandise</Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-lg-2 col-md-6">
                            <div style={topicBoxStyle}>
                                <h4 style={topicHeadingStyle}>Quick Links</h4>
                                <Link className="btn btn-link d-block text-start" to="/about" style={linkStyle}>Our Story</Link>
                                <Link className="btn btn-link d-block text-start" to="/contact" style={linkStyle}>Contact Us</Link>
                                <Link className="btn btn-link d-block text-start" to="/locations" style={linkStyle}>Find Us</Link>
                                <Link className="btn btn-link d-block text-start" to="/privacy" style={linkStyle}>Privacy Policy</Link>
                                <Link className="btn btn-link d-block text-start" to="/faq" style={linkStyle}>FAQ</Link>
                            </div>
                        </div>

                        {/* Stay Connected */}
                        <div className="col-lg-4 col-md-6">
                            <div style={topicBoxStyle}>
                                <h4 style={topicHeadingStyle}>Stay Connected</h4>
                                <p>Join our newsletter for fresh updates and exclusive offers!</p>
                                <div className="position-relative w-100">
                                    <input className="form-control bg-light border-light w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                                    <button type="button" className="btn py-2 position-absolute top-0 end-0 mt-2 me-2 text-white" style={buttonStyle}>
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container-fluid copyright py-4" style={{ backgroundColor: '#4A2C2A', color: '#E8E2D7' }}>
                <div className="container">
                    <div className="row text-start">
                        <div className="col-md-6 mb-3 mb-md-0">
                            &copy; <Link className="border-bottom" to="/" style={{ color: '#E8E2D7' }}>COFFEE</Link>, All Right Reserved.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;

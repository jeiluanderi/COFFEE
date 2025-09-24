import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const [contactInfo, setContactInfo] = useState({
        phone: '',
        email: '',
        socials: []
    });

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/contact');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setContactInfo(data);
            } catch (error) {
                console.error("Failed to fetch contact information:", error);
                // Fallback to hardcoded values if fetch fails
                setContactInfo({
                    phone: "+012 345 6789",
                    email: "info@example.com",
                    socials: [
                        { icon: "twitter", url: "https://twitter.com/" },
                        { icon: "facebook-f", url: "https://www.facebook.com/" },
                        { icon: "instagram", url: "https://www.instagram.com/" },
                        { icon: "linkedin-in", url: "https://www.linkedin.com/" }
                    ]
                });
            }
        };

        fetchContactInfo();
    }, []);

    return (
        <div className="footer-container text-[#E8E2D7] mt-5 wow fadeIn" data-wow-delay="0.1s">
            <style>
                {`
                .footer-container {
                    background-color: #4A2C2A;
                    color: #E8E2D7;
                }
                .footer-link {
                    color: #E8E2D7;
                }
                .topic-box {
                    border: 1px solid rgba(232, 226, 215, 0.2);
                    border-radius: 8px;
                    padding: 1rem;
                    background-color: rgba(232, 226, 215, 0.1);
                    box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
                }
                .topic-heading {
                    color: #E8E2D7;
                    margin-bottom: 1rem;
                    font-weight: bold;
                }
                .subscribe-button {
                    background-color: #F5EFE6;
                    border-color: #F5EFE6;
                    color: #4A2C2A;
                }
                .footer-divider {
                    border-top: 1px solid rgba(232, 226, 215, 0.2);
                }
                .footer-link-hover:hover {
                    color: #C27A48 !important;
                    transform: translateX(5px);
                }
                .social-icon-hover:hover {
                    background-color: #C27A48 !important;
                    border-color: #C27A48 !important;
                }
                `}
            </style>

            {/* Top Section */}
            <div className="container py-5">
                <div className="row g-4 text-start">
                    {/* Visit Us */}
                    <div className="col-lg-3 col-md-6">
                        <div className="topic-box">
                            <h4 className="topic-heading">Visit Us</h4>
                            <p className="mb-2 transition duration-300 transform footer-link-hover">
                                <i className="fa fa-map-marker-alt me-3"></i>
                                456 Brew Street, Cityville, USA
                            </p>
                            <p className="mb-2 transition duration-300 transform footer-link-hover">
                                <i className="fa fa-phone-alt me-3"></i>
                                {contactInfo.phone}
                            </p>
                            <p className="mb-2 transition duration-300 transform footer-link-hover">
                                <i className="fa fa-envelope me-3"></i>
                                {contactInfo.email}
                            </p>
                            <div className="d-flex pt-2">
                                {contactInfo.socials.map((social, index) => (
                                    <a key={index} className="btn btn-square btn-outline-light rounded-circle me-2 transition duration-300 social-icon-hover" href={social.url} target="_blank" rel="noopener noreferrer">
                                        <i className={`fab fa-${social.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Our Menu */}
                    <div className="col-lg-3 col-md-6">
                        <div className="topic-box">
                            <h4 className="topic-heading">Our Menu</h4>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/menu">Espresso & Coffee</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/menu">Specialty Drinks</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/menu">Teas & Cold Brews</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/menu">Pastries & Bites</Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <div className="topic-box">
                            <h4 className="topic-heading">Quick Links</h4>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/about">Our Story</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/contact">Contact Us</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/locations">Find Us</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/privacy">Privacy Policy</Link>
                            <Link className="btn btn-link d-block text-start transition duration-300 transform footer-link-hover footer-link" to="/faq">FAQ</Link>
                        </div>
                    </div>

                    {/* Stay Connected */}
                    <div className="col-lg-4 col-md-6">
                        <div className="topic-box">
                            <h4 className="topic-heading">Stay Connected</h4>
                            <p>Join our newsletter for fresh updates and exclusive offers!</p>
                            <div className="position-relative w-100">
                                <input className="form-control bg-[#E8E2D7] border-[#E8E2D7] w-100 py-3 ps-4 pe-5 text-[#4A2C2A]" type="text" placeholder="Your email" />
                                <button type="button" className="btn py-2 position-absolute top-0 end-0 mt-2 me-2 text-[#4A2C2A] transition duration-300 social-icon-hover subscribe-button">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-0 w-75 mx-auto footer-divider" />

            {/* Bottom Section */}
            <div className="container py-4">
                <div className="row text-start">
                    <div className="col-md-6 mb-3 mb-md-0">
                        &copy; <Link className="border-bottom footer-link-hover footer-link" to="/">COFFEE</Link>, All Right Reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;

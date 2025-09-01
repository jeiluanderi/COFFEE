import React from 'react';

const Topbar = () => {
    return (
        <div className="container-fluid bg-buna text-light px-0 py-2">
            <div className="row gx-0 d-none d-lg-flex">
                <div className="col-lg-7 px-5 text-start">
                    <div className="h-100 d-inline-flex align-items-center me-4">
                        <span className="fa fa-phone-alt me-2"></span>
                        <span>+012 345 6789</span>
                    </div>
                    <div className="h-100 d-inline-flex align-items-center">
                        <span className="far fa-envelope me-2"></span>
                        <span>info@example.com</span>
                    </div>
                </div>
                <div className="col-lg-5 px-5 text-end">
                    <div className="h-100 d-inline-flex align-items-center mx-n2">
                        <span>Follow Us:</span>
                        <a className="btn btn-link text-light" href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-link text-light" href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-link text-light" href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                        <a className="btn btn-link text-light" href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Topbar;
import React from 'react';

const whyUsData = [
    { iconClass: "fa fa-check fa-3x text-primary", title: "Freshly Roasted", delay: "0.3s" },
    { iconClass: "fa fa-users fa-3x text-primary", title: "Expert Baristas", delay: "0.5s" },
    { iconClass: "fa fa-tools fa-3x text-primary", title: "Handcrafted Drinks", delay: "0.7s" },
];

const WhyUsSection = () => {
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                        <p className="fs-5 fw-bold text-primary">Why Choose Our Brew!</p>
                        <h1 className="display-5 mb-4">Reasons Our Coffee Stands Out!</h1>
                        <p className="mb-4">From bean to cup, every step is a labor of love. We source the finest beans, roast them to perfection, and pour our passion into every drink, ensuring a rich and authentic coffee experience.</p>
                        <a className="btn btn-primary py-3 px-4" href="">Discover Our Story</a>
                    </div>
                    <div className="col-lg-6">
                        <div className="row g-4 align-items-center">
                            <div className="col-md-6">
                                <div className="row g-4">
                                    <div className="col-12 wow fadeIn" data-wow-delay={whyUsData[0].delay}>
                                        <div className="text-center rounded py-5 px-4" style={{ boxShadow: '0 0 45px rgba(0,0,0,.08)' }}>
                                            <div className="btn-square bg-light rounded-circle mx-auto mb-4" style={{ width: '90px', height: '90px' }}>
                                                <i className={whyUsData[0].iconClass}></i>
                                            </div>
                                            <h4 className="mb-0">{whyUsData[0].title}</h4>
                                        </div>
                                    </div>
                                    <div className="col-12 wow fadeIn" data-wow-delay={whyUsData[1].delay}>
                                        <div className="text-center rounded py-5 px-4" style={{ boxShadow: '0 0 45px rgba(0,0,0,.08)' }}>
                                            <div className="btn-square bg-light rounded-circle mx-auto mb-4" style={{ width: '90px', height: '90px' }}>
                                                <i className={whyUsData[1].iconClass}></i>
                                            </div>
                                            <h4 className="mb-0">{whyUsData[1].title}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 wow fadeIn" data-wow-delay={whyUsData[2].delay}>
                                <div className="text-center rounded py-5 px-4" style={{ boxShadow: '0 0 45px rgba(0,0,0,.08)' }}>
                                    <div className="btn-square bg-light rounded-circle mx-auto mb-4" style={{ width: '90px', height: '90px' }}>
                                        <i className={whyUsData[2].iconClass}></i>
                                    </div>
                                    <h4 className="mb-0">{whyUsData[2].title}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyUsSection;
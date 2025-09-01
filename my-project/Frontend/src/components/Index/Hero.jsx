import React from "react";
import img from "../../assets/img/coffeeback.jpg";
import coffee2 from "../../assets/img/coffee2.jpg";
import bgcoff from "../../assets/img/BGCoff.jpg";

export const Hero = () => {
    return (
        <div className="container-fluid p-0 wow fadeIn" data-wow-delay="0.1s">
            <div
                id="header-carousel"
                className="carousel slide"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">
                    {/* First Slide - Coffee Theme */}
                    <div className="carousel-item active">
                        <img className="w-100" src={img} alt="Freshly roasted coffee beans" />
                        <div className="carousel-caption">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <h1 className="display-1 text-white mb-5 animated slideInDown">
                                            The Perfect Brew, Every Time
                                        </h1>
                                        <a
                                            href="#"
                                            className="btn btn-primary py-sm-3 px-sm-4"
                                        >
                                            Explore Our Menu
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Slide - Coffee Theme */}
                    <div className="carousel-item">
                        <img className="w-100" src={coffee2} alt="A barista pouring coffee" />
                        <div className="carousel-caption">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-7">
                                        <h1 className="display-1 text-white mb-5 animated slideInDown">
                                            Handcrafted with Passion
                                        </h1>
                                        <a
                                            href="#"
                                            className="btn btn-primary py-sm-3 px-sm-4"
                                        >
                                            Find a Store
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Controls */}
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#header-carousel"
                    data-bs-slide="prev"
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#header-carousel"
                    data-bs-slide="next"
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};
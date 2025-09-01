import React from 'react';
import servicesImage1 from '../../assets/img/brewing-methods.jpg';
import servicesImage2 from '../../assets/img/cafe-interior.jpg';
import servicesImage3 from '../../assets/img/pastries.jpg';
import servicesImage4 from '../../assets/img/cold-brew.jpg';
import servicesImage5 from '../../assets/img/online-shop.jpg';
import servicesImage6 from '../../assets/img/private-events.jpg';

// Data for the services
const servicesData = [
    {
        mainImage: servicesImage1,
        icon: 'fas fa-coffee',
        title: 'Artisan Roasting',
        description: 'We meticulously roast our beans in small batches to bring out their unique flavors and aromas, ensuring a fresh and rich taste.',
        delay: '0.1s'
    },
    {
        mainImage: servicesImage2,
        icon: 'fas fa-mug-hot',
        title: 'Handcrafted Espresso',
        description: 'Our expert baristas craft perfect espressos, from classic Americanos to lattes with beautiful latte art, tailored to your preference.',
        delay: '0.3s'
    },
    {
        mainImage: servicesImage3,
        icon: 'fas fa-cookie-bite',
        title: 'Freshly Baked Pastries',
        description: 'Pair your favorite coffee with our selection of daily baked pastries, made with high-quality ingredients for a delightful treat.',
        delay: '0.5s'
    },
    {
        mainImage: servicesImage4,
        icon: 'fas fa-glass-whiskey',
        title: 'Signature Cold Brew',
        description: 'Our signature cold brew is steeped for 24 hours to create a smooth, low-acidity coffee, perfect for a refreshing pick-me-up.',
        delay: '0.1s'
    },
    {
        mainImage: servicesImage5,
        icon: 'fas fa-store',
        title: 'Online Coffee Shop',
        description: 'Order your favorite beans and brewing equipment from our online store and enjoy our handcrafted coffee from the comfort of your home.',
        delay: '0.3s'
    },
    {
        mainImage: servicesImage6,
        icon: 'fas fa-calendar-alt',
        title: 'Private Events',
        description: 'Host your special events at our cozy cafe. We offer a unique and inviting atmosphere with personalized coffee catering.',
        delay: '0.5s'
    },
];

// Reusable Service Card Component
const ServiceCard = ({ mainImage, icon, title, description, delay }) => (
    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={delay}>
        <div className="service-item rounded d-flex h-100">
            <div className="service-img rounded">
                <img className="img-fluid" src={mainImage} alt={title} />
            </div>
            <div className="service-text rounded p-5">
                <div className="btn-square rounded-circle mx-auto mb-3">
                    <i className={`${icon} fa-3x text-primary`}></i>
                </div>
                <h4 className="mb-3">{title}</h4>
                <p className="mb-4">{description}</p>
                <a className="btn btn-sm" href="">
                    <i className="fa fa-plus text-primary me-2"></i>Read More
                </a>
            </div>
        </div>
    </div>
);

// Main Services Section Component
const ServicesSection = () => {
    return (
        <div className="container-xxl py-5">
            {/* The internal CSS block */}
            <style jsx="true">{`
                .service-item .service-img {
                    overflow: hidden;
                }
                .service-item .service-img img {
                    transition: transform 0.5s ease;
                }
                .service-item:hover .service-img img {
                    transform: scale(1.1); /* Zooms in on hover */
                }
                .service-item:hover .service-img::before {
                    background-color: transparent; /* Removes the overlay on hover */
                }
            `}</style>

            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Offerings</p>
                    <h1 className="display-5 mb-5">Discover What We Brew For You</h1>
                </div>
                <div className="row g-4">
                    {servicesData.map((service, index) => (
                        <ServiceCard
                            key={index}
                            mainImage={service.mainImage}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            delay={service.delay}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesSection;
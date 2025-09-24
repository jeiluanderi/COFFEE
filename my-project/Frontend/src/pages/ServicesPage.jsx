import React, { useState, useEffect } from 'react';
// import PageHeader from '../components/Shared/PageHeader';
// Note: You can remove the static image imports since the data will now come from the backend.
// import servicesImage1 from '../../assets/img/brewing-methods.jpg';
// ...etc.

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
const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Display 3 services per page

    // Fetch data from the backend on component mount
    useEffect(() => {
        const backendUrl = 'http://localhost:3001/api/services';

        const fetchServices = async () => {
            try {
                const response = await fetch(backendUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Calculate items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(services.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Conditional rendering for loading and error states
    if (isLoading) {
        return (
            <div className="container py-5 text-center">
                <p>Loading services...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center text-danger">
                <p>Error: {error}</p>
                <p>Please ensure your backend server is running and the API endpoint is correct.</p>
            </div>
        );
    }

    return (
        <div className="container-xxl py-5">
            <style jsx="true">{`
                .service-item .service-img {
                    overflow: hidden;
                }
                .service-item .service-img img {
                    transition: transform 0.5s ease;
                }
                .service-item:hover .service-img img {
                    transform: scale(1.1);
                }
                .service-item:hover .service-img::before {
                    background-color: transparent;
                }
                    

                /* Add new styles for the pagination buttons */
                .pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 2rem;
                    gap: 0.5rem;
                }
                .pagination button {
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
                    border: 1px solid var(--bs-primary);
                    background-color: white;
                    color: var(--bs-primary);
                    cursor: pointer;
                }
                .pagination button.active {
                    background-color: var(--bs-primary);
                    color: white;
                    border-color: var(--bs-primary);
                }
                :root {
                    --bs-primary: #8B4513; /* Assuming this is your primary color */
                }
            `}</style>
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Offerings</p>
                    <h1 className="display-5 mb-5">Discover What We Brew For You</h1>
                </div>
                <div className="row g-4">
                    {currentServices.map((service, index) => (
                        <ServiceCard
                            key={service.id || index}
                            mainImage={service.image_src} // Change from service.image_url to service.image_src
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            delay={service.delay}
                        />
                    ))}
                </div>
                {/* Pagination UI */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? 'active' : ''}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
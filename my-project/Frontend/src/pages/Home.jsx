import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Index/Hero';
import TopFeature from '../components/Index/TopFeature';
import About from '../components/Index/About';
import Features from '../components/Index/Features';
import Service from '../components/Index/Service';
import Testimonial from '../components/Index/Testimonial';
import FactCounter from '../components/FactCounter/FactCounter';
import Spinner from '../components/shared/Spinner';
import InquiryFormSection from '../components/Index/InquiryFormSection';
import TeamSection from '../components/Index/Team';
import axios from 'axios';
import '../styles/CoffeeProduct.css';

function Home() {
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Number of coffees per page

    useEffect(() => {
        const fetchCoffees = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/coffees');
                setCoffees(response.data);
            } catch (err) {
                console.error('Error fetching coffees:', err);
                setError('Failed to load coffee products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const spinnerTimer = setTimeout(() => {
            setLoading(false);
        }, 150);

        fetchCoffees();

        return () => clearTimeout(spinnerTimer);
    }, []);

    if (loading) return <Spinner />;
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-red-600 text-lg p-4 bg-white rounded-lg shadow-md">{error}</p>
            </div>
        );
    }

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCoffees = coffees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(coffees.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Hero />
            <TopFeature />
            <About />
            <FactCounter />

            <div className="coffee-grid-container">
                <h2 className="coffee-section-title">Our Delicious Coffees</h2>

                {currentCoffees.length > 0 ? (
                    <div className="coffee-grid">
                        {currentCoffees.map((coffee) => (
                            <div key={coffee.id} className="coffee-item-card">
                                <img
                                    src={coffee.image_url || `https://placehold.co/400x300/e0e0e0/000000?text=${encodeURIComponent(coffee.name)}`}
                                    alt={coffee.name}
                                    className="coffee-product-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://placehold.co/400x300/e0e0e0/000000?text=Image+Missing`;
                                    }}
                                />
                                <div className="coffee-overlay-text">
                                    <h3 className="coffee-item-name">{coffee.name}</h3>
                                    <p className="coffee-item-description">
                                        {coffee.description || 'A rich and aromatic coffee experience.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="coffee-no-products-message">No coffee products available yet. Please add some from the admin panel!</p>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Features />
            <Service />
            <InquiryFormSection />
            <TeamSection />
            <Testimonial />
        </>
    );
}

export default Home;

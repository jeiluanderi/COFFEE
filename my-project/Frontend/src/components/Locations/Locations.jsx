import React, { useState, useEffect } from 'react';

// Reusable Location Card Component
const LocationCard = ({ locationName, address, hours, imgSrc, mapLink, category, delay }) => (
    <div className={`col-lg-4 col-md-6 wow fadeInUp ${category}`} data-wow-delay={delay}>
        <div className="location-item rounded overflow-hidden h-100 d-flex flex-column"> {/* Added flex-column and overflow-hidden */}
            <div className="location-img" style={{ height: '250px', overflow: 'hidden' }}> {/* Increased height for location images */}
                <img className="img-fluid w-100 h-100 object-cover" src={imgSrc} alt={locationName} />
            </div>
            <div className="location-text p-4 flex-grow-1 d-flex flex-column justify-content-between"> {/* Flex grow to fill space */}
                <div>
                    <h4 className="mb-2">{locationName}</h4>
                    <p className="text-muted mb-2"><i className="fa fa-map-marker-alt me-2"></i>{address}</p>
                    <p className="text-muted mb-3"><i className="fa fa-clock me-2"></i>{hours}</p>
                </div>
                <div className="d-flex justify-content-center pt-2">
                    <a className="btn btn-primary py-2 px-4 rounded-pill" href={mapLink} target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-map-marked-alt me-2"></i>View on Map
                    </a>
                </div>
            </div>
        </div>
    </div>
);

// Main Locations Section Component
const LocationsSection = () => {
    const [locations, setLocations] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('*');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/locations');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLocations(data);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
                setError("Failed to load locations. Please check the server connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const filteredLocations = currentFilter === '*'
        ? locations
        : locations.filter(location => `.${location.category}` === currentFilter);

    if (isLoading) {
        return (
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center w-full">
                        <p className="text-xl">Loading locations...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center w-full">
                        <p className="text-xl text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Filter data for the unique categories to create the filter buttons
    const uniqueCategories = [...new Set(locations.map(location => location.category))];
    const filters = [
        { label: 'All', filter: '*' },
        ...uniqueCategories.map(cat => ({ label: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Locations`, filter: `.${cat}` }))
    ];

    return (
        <div className="container-xxl py-5">
            {/* Internal CSS for consistent card height and image fitting */}
            <style >{`
                .location-item {
                    box-shadow: 0 0 45px rgba(0,0,0,.08);
                    transition: transform 0.3s ease-in-out;
                }
                .location-item:hover {
                    transform: translateY(-10px); /* Subtle lift effect on hover */
                }
                .location-img img {
                    object-fit: cover;
                }
                /* Filter active state styling */
                #portfolio-flters .active {
                    background-color: #8B4513; /* Primary color for active filter */
                    color: white;
                    border-radius: 5px; /* Added rounded corners */
                }
                #portfolio-flters li {
                    cursor: pointer;
                    padding: 8px 15px;
                    transition: all 0.3s ease;
                }
                #portfolio-flters li:hover {
                    background-color: #F8F5EB; /* Light cream on hover for inactive */
                    color: #6F4E37; /* Coffee brown text on hover */
                    border-radius: 5px;
                }
            `}</style>
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Locations</p>
                    <h1 className="display-5 mb-5">Find Your Nearest COFFEE</h1>
                </div>
                <div className="row wow fadeInUp" data-wow-delay="0.3s">
                    <div className="col-12 text-center mb-5">
                        <ul className="list-inline rounded mb-0" id="portfolio-flters">
                            {filters.map((filterItem, index) => (
                                <li
                                    key={index}
                                    className={`mx-2 ${filterItem.filter === currentFilter ? 'active' : ''}`}
                                    data-filter={filterItem.filter}
                                    onClick={() => setCurrentFilter(filterItem.filter)}
                                >
                                    {filterItem.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="row g-4">
                    {filteredLocations.map((location, index) => (
                        <LocationCard
                            key={location.id}
                            locationName={location.location_name}
                            address={location.address}
                            hours={location.hours}
                            imgSrc={location.image_url}
                            mapLink={location.map_link}
                            category={location.category}
                            delay={`${(index * 0.2) + 0.1}s`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationsSection;

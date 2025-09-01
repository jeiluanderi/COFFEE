import React, { useState } from 'react';

// Import local images for the location items (user will replace these)
import locationImg1 from '../../assets/img/cafe-exterior-1.jpg';
import locationImg2 from '../../assets/img/cafe-interior-2.jpg';
import locationImg3 from '../../assets/img/urban-cafe-3.jpg';
import locationImg4 from '../../assets/img/suburban-cafe-4.jpg';
import locationImg5 from '../../assets/img/cozy-cafe-5.jpg';
import locationImg6 from '../../assets/img/modern-cafe-6.jpg';

// Data for the coffee shop locations
const locationsData = [
    {
        locationName: 'Downtown Brew Haven',
        address: '123 Main St, Cityville, CA 90210',
        hours: 'Mon-Sun: 7 AM - 8 PM',
        imgSrc: locationImg1,
        mapLink: 'https://maps.google.com/?q=123+Main+St,+Cityville', // Placeholder Google Maps link
        category: 'city',
        delay: '0.1s',
    },
    {
        locationName: 'Uptown Coffee Corner',
        address: '456 Oak Ave, Metropolis, NY 10001',
        hours: 'Mon-Fri: 6:30 AM - 7 PM, Sat-Sun: 8 AM - 6 PM',
        imgSrc: locationImg2,
        mapLink: 'https://maps.google.com/?q=456+Oak+Ave,+Metropolis',
        category: 'city',
        delay: '0.3s',
    },
    {
        locationName: 'Riverside Roast',
        address: '789 River Rd, Suburbia, TX 77001',
        hours: 'Mon-Sun: 7:30 AM - 5 PM',
        imgSrc: locationImg3,
        mapLink: 'https://maps.google.com/?q=789+River+Rd,+Suburbia',
        category: 'suburban',
        delay: '0.5s',
    },
    {
        locationName: 'The Daily Grind Express',
        address: '101 Market St, Townsville, FL 33101',
        hours: 'Mon-Fri: 6 AM - 4 PM',
        imgSrc: locationImg4,
        mapLink: 'https://maps.google.com/?q=101+Market+St,+Townsville',
        category: 'city',
        delay: '0.1s',
    },
    {
        locationName: 'Greenwich Beanery',
        address: '22 Elm St, Countryside, WA 98101',
        hours: 'Mon-Sun: 8 AM - 4 PM',
        imgSrc: locationImg5,
        mapLink: 'https://maps.google.com/?q=22+Elm+St,+Countryside',
        category: 'suburban',
        delay: '0.3s',
    },
    {
        locationName: 'Coastal Cafe',
        address: '55 Beach Blvd, Seaville, CA 90211',
        hours: 'Mon-Sun: 7 AM - 9 PM',
        imgSrc: locationImg6,
        mapLink: 'https://maps.google.com/?q=55+Beach+Blvd,+Seaville',
        category: 'city', // Could be 'coastal' if you add that category
        delay: '0.5s',
    },
];

const filters = [
    { label: 'All', filter: '*', active: true },
    { label: 'City Locations', filter: '.city', active: false },
    { label: 'Suburban Locations', filter: '.suburban', active: false },
];

// Reusable Location Card Component
const LocationCard = ({ locationName, address, hours, imgSrc, mapLink, delay }) => (
    <div className={`col-lg-4 col-md-6 wow fadeInUp`} data-wow-delay={delay}>
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
    const [currentFilter, setCurrentFilter] = useState('*');

    const filteredLocations = currentFilter === '*'
        ? locationsData
        : locationsData.filter(location => `.${location.category}` === currentFilter);

    return (
        <div className="container-xxl py-5">
            {/* Internal CSS for consistent card height and image fitting */}
            <style jsx>{`
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
                    <h1 className="display-5 mb-5">Find Your Nearest BrewHaven</h1>
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
                            key={index}
                            locationName={location.locationName}
                            address={location.address}
                            hours={location.hours}
                            imgSrc={location.imgSrc}
                            mapLink={location.mapLink}
                            delay={location.delay}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationsSection;

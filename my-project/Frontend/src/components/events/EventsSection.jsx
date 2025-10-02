import React from 'react';

const eventsData = [
    {
        iconClass: "fas fa-calendar-alt text-primary", // Calendar icon
        title: "Live Music Night",
        description: "Enjoy a relaxing evening with local acoustic artists and your favorite brew.",
        date: "Every Friday, 7 PM - 9 PM",
        delay: "0.1s"
    },
    {
        iconClass: "fas fa-coffee text-primary", // Coffee bean icon
        title: "Coffee Tasting Workshop",
        description: "Explore the nuances of different beans and brewing methods with our expert baristas.",
        date: "Every Saturday, 10 AM - 12 PM",
        delay: "0.3s"
    },
    {
        iconClass: "fas fa-pencil-alt text-primary", // Pencil/writing icon
        title: "Open Mic Poetry",
        description: "Share your voice or simply listen to inspiring poetry in a cozy atmosphere.",
        date: "Last Wednesday of Month, 6 PM - 8 PM",
        delay: "0.5s"
    },
    {
        iconClass: "fas fa-book-open text-primary", // Book icon
        title: "Book Club Meetup",
        description: "Join our community book club for engaging discussions and great coffee.",
        date: "2nd Tuesday of Month, 6 PM - 7:30 PM",
        delay: "0.1s" // Reset delay for next row
    },
    {
        iconClass: "fas fa-paint-brush text-primary", // Paintbrush icon
        title: "Art & Sip Session",
        description: "Unleash your creativity with guided painting while enjoying refreshing beverages.",
        date: "Check schedule for dates",
        delay: "0.3s"
    },
    {
        iconClass: "fas fa-wifi text-primary", // Wi-fi icon for coworking
        title: "Freelancer Focus Day",
        description: "Dedicated quiet hours for focused work with unlimited coffee refills.",
        date: "Every Thursday, 9 AM - 4 PM",
        delay: "0.5s"
    }
];

const EventsSection = () => {
    // Define a color palette for use in CSS
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    return (
        <div className="container-fluid py-5">
            {/* Internal CSS for the event cards hover effect */}
            <style >{`
                .event-card-item {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out; /* Added background-color to transition */
                    cursor: pointer; /* Indicates it's interactive */
                    background-color: white; /* Ensure base background is white */
                }

                .event-card-item:hover {
                    transform: scale(0.98); /* Zooms the card out slightly */
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Lighter, more subtle shadow on zoom out */
                    background-color: rgba(139, 69, 19, 0.05); /* Very subtle transparent brown background */
                }
            `}</style>
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Events</p>
                    <h1 className="display-5 mb-5">Join Us For Special Occasions</h1>
                </div>
                <div className="row gx-0 gy-4"> {/* Added gy-4 for vertical gap between items on small screens */}
                    {eventsData.map((event, index) => (
                        <div key={index} className="col-lg-4 col-md-6 wow fadeIn" data-wow-delay={event.delay}>
                            {/* Applied event-card-item class here for hover effects */}
                            <div className="shadow d-flex align-items-center h-100 px-4 py-4 rounded event-card-item" style={{ minHeight: '160px' }}>
                                <div className="d-flex w-100">
                                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-light me-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <i className={event.iconClass} style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <div className="ps-3 flex-grow-1">
                                        <h4>{event.title}</h4>
                                        <span className="text-muted d-block mb-2">{event.description}</span>
                                        <span className="text-primary fw-bold"><i className="far fa-calendar-alt me-2"></i>{event.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsSection;

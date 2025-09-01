import React from 'react';

// Import local images for the team members (user will replace these)
// Corrected paths: images are now directly inside '../../assets/img/'
import baristaImg1 from '../../assets/img/barista-1.jpg'; // Placeholder for Head Barista
import baristaImg2 from '../../assets/img/barista-2.jpg'; // Placeholder for Senior Barista
import baristaImg3 from '../../assets/img/barista-3.jpg'; // Placeholder for Coffee Roaster
import baristaImg4 from '../../assets/img/barista-4.jpg'; // Placeholder for Cafe Manager
import baristaImg5 from '../../assets/img/barista-5.jpg'; // NEW: Placeholder for Junior Barista
import baristaImg6 from '../../assets/img/barista-6.jpg'; // NEW: Placeholder for Roastery Assistant

const teamMembersData = [
    {
        imageUrl: baristaImg1,
        name: 'Alex Martinez',
        role: 'Head Barista'
    },
    {
        imageUrl: baristaImg2,
        name: 'Sophia Chen',
        role: 'Senior Barista'
    },
    {
        imageUrl: baristaImg3,
        name: 'David Lee',
        role: 'Coffee Roaster'
    },
    {
        imageUrl: baristaImg4,
        name: 'Emily Davis',
        role: 'Cafe Manager'
    },
    { // NEW Team Member 5
        imageUrl: baristaImg5,
        name: 'Chris Green',
        role: 'Junior Barista'
    },
    { // NEW Team Member 6
        imageUrl: baristaImg6,
        name: 'Olivia Brown',
        role: 'Roastery Assistant'
    }
];

// Reusable TeamMember component with internal CSS for consistent styling
const TeamMember = ({ imageUrl, name, role }) => {
    return (
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            {/* Internal CSS for the TeamMember card */}
            <style jsx>{`
                .team-item {
                    box-shadow: none; /* Removed box-shadow to make it truly transparent */
                    transition: transform 0.3s ease; /* Smooth transition for hover effect */
                    position: relative;
                    overflow: hidden;
                    background-color: transparent; /* Made the entire item background transparent */
                }
                .team-item:hover {
                    transform: translateY(-10px); /* Lifts the card slightly on hover */
                }
                .team-item img {
                    width: 100%;
                    height: 500px; /* Fixed height for all team member images */
                    object-fit: cover; /* Ensures images fill the space without distortion */
                }
                .team-text {
                    padding: 1.5rem; /* Padding around the text content */
                    text-align: center; /* Center aligns text */
                    background-color: transparent; /* This was already transparent, ensuring no overlay */
                }
                .team-social {
                    display: flex; /* Use flexbox for horizontal alignment of buttons */
                    align-items: center;
                    justify-content: center; /* Center social icons horizontally */
                    padding-top: 1rem; /* Space between role and social icons */
                }
                .team-social .btn {
                    color: #8B4513; /* Dark brown for social icons by default */
                    border-color: #8B4513; /* Dark brown border for icons */
                    transition: all 0.3s ease; /* Smooth transition for button hover effects */
                }
                .team-social .btn:hover {
                    background-color: #8B4513; /* Saddle Brown background on hover */
                    color: white; /* White icon on hover */
                    
                }
                .team-text .text-primary {
                    color: #8B4513 !important; /* Ensuring the role text is our primary brown color */
                }
            `}</style>
            <div className="team-item rounded">
                <div className="position-relative">
                    <img className="img-fluid" src={imageUrl} alt={name} />
                </div>
                <div className="team-text">
                    <h5 className="mb-0">{name}</h5>
                    <p className="text-primary">{role}</p> {/* text-primary class ensures consistent role color */}
                    <div className="team-social d-flex"> {/* Moved social links inside team-text */}
                        {/* Placeholder social links */}
                        <a className="btn btn-square rounded-circle mx-1" href="#"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-square rounded-circle mx-1" href="#"><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-square rounded-circle mx-1" href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TeamSection = () => {
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '500px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Baristas</p>
                    <h1 className="display-5 mb-5">Meet Our Passionate Coffee Makers</h1>
                </div>
                <div className="row g-4">
                    {teamMembersData.map((member, index) => (
                        <TeamMember
                            key={index}
                            imageUrl={member.imageUrl}
                            name={member.name}
                            role={member.role}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamSection;

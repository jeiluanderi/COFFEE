import React, { useState, useEffect } from 'react';

const TeamSection = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    
    useEffect(() => {
      
        const backendUrl = 'http://localhost:3001/api/baristas';

        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(backendUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTeamMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    // Calculate items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeamMembers = teamMembers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(teamMembers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const TeamMember = ({ imageUrl, name, role }) => {
        return (
            <div className="team-item">
                <div className="team-img">
                    <img className="img-fluid" src={imageUrl} alt={name} />
                    <div className="team-social">
                        <a className="btn btn-link text-light" href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-link text-light" href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-link text-light" href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                        <a className="btn btn-link text-light" href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="team-text">
                    <h5>{name}</h5>
                    <p>{role}</p>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="container loading">
                <p>Loading team members...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container error">
                <p>Error: {error}</p>
                <p>Please ensure your backend server is running and the API endpoint is correct.</p>
            </div>
        );
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: #f7f7f7;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 2rem;
                    }

                    .loading, .error {
                        text-align: center;
                        padding: 4rem;
                    }

                    .loading p {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #8B4513;
                    }

                    .error p {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #ff0000;
                    }

                    .heading-container {
                        text-align: center;
                        max-width: 500px;
                        margin: 0 auto 3rem;
                    }
                    
                    .heading-container p {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #8B4513;
                    }

                    .heading-container h1 {
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin-top: 0.5rem;
                    }

                    .team-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 2rem;
                        justify-content: center;
                    }

                    /* --- Team Section Styling --- */
                    .team-item {
                        position: relative;
                        overflow: hidden;
                        border-radius: 0.75rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    
                    .team-item:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
                    }
                    
                    .team-img {
                        position: relative;
                    }

                    .team-img .img-fluid {
                        width: 100%;
                        height: 400px;
                        object-fit: cover;
                        border-radius: 0.75rem;
                    }

                    .team-item .team-text {
                        position: absolute;
                        width: calc(100% - 45px);
                        left: -100%;
                        bottom: 45px;
                        padding: 1.5rem;
                        background: #FFFFFF;
                        border-radius: 0 4px 4px 0;
                        opacity: 0;
                        transition: .5s;
                    }
                    
                    .team-item:hover .team-text {
                        left: 0;
                        opacity: 1;
                    }
                    
                    .team-item .team-img .team-social {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: .5s;
                        z-index: 3;
                        opacity: 0;
                        background: rgba(0, 0, 0, 0.5); /* Overlay to make social icons stand out */
                    }
                    
                    .team-item:hover .team-img .team-social {
                        transition-delay: .3s;
                        opacity: 1;
                    }

                    .team-social .btn {
                        background: #f7f7f7;
                        color: #8B4513;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        margin: 0 0.25rem;
                        transition: .3s;
                    }
                    
                    .team-social .btn:hover {
                        background: #8B4513;
                        color: #f7f7f7;
                    }

                    .team-text h5 {
                        font-size: 1.25rem;
                        font-weight: 600;
                        margin: 0 0 0.25rem;
                    }

                    .team-text p {
                        font-size: 1rem;
                        color: #8B4513;
                        font-weight: 500;
                        margin: 0;
                    }

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
                        border: 1px solid #8B4513;
                        background-color: white;
                        color: #8B4513;
                        cursor: pointer;
                    }

                    .pagination button.active {
                        background-color: #8B4513;
                        color: white;
                        border-color: #8B4513;
                    }
                `}
            </style>

            <div className="container">
                <div className="heading-container">
                    <p>Our Baristas</p>
                    <h1>Meet Our Passionate Coffee Makers</h1>
                </div>

                <div className="team-grid">
                    {currentTeamMembers.map((member) => (
                        <TeamMember
                            key={member.id}
                            imageUrl={member.image_url}
                            name={member.name}
                            role={member.role}
                        />
                    ))}
                </div>

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
        </>
    );
};

export default TeamSection;

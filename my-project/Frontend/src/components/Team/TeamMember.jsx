import React from 'react';

const TeamMember = ({ imageUrl, name, role }) => {
    return (
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="team-item rounded">
                <img className="img-fluid" src={imageUrl} alt={name} />
                <div className="team-text">
                    <h4 className="mb-0">{name}</h4>
                    <p className="text-primary">{role}</p>
                    <div className="team-social d-flex">
                        <a className="btn btn-square rounded-circle me-2" href=""><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-square rounded-circle me-2" href=""><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-square rounded-circle me-2" href=""><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMember;
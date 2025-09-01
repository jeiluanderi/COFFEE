import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const colors = {
    primary: '#8B4513',
    secondary: '#6F4E37',
    light: '#F8F5EB',
    dark: '#36220B'
};

function Header() {
    const [isMoreHovered, setIsMoreHovered] = useState(false);
    const [isUserHovered, setIsUserHovered] = useState(false);

    // Correctly use the hooks from their respective context files
    const { totalItems } = useCart();
    const { isLoggedIn, user, logout } = useAuth();
    console.log("is logged===============.", isLoggedIn)
    console.log("user ================>", user)
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinkStyle = ({ isActive, isHoveredProp }) => ({
        color: isActive ? colors.dark : colors.secondary,
        backgroundColor: 'transparent',
        borderRadius: '0',
        padding: '0.5rem 1rem',
        transition: 'all 0.3s ease',
        margin: '0 0.25rem',
        transform: isHoveredProp ? 'scale(1.05)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
    });

    const dropdownItemStyle = ({ isActive, isHoveredProp }) => ({
        color: isActive ? colors.dark : colors.secondary,
        backgroundColor: 'transparent',
        padding: '0.5rem 1rem',
        transition: 'all 0.3s ease',
        transform: isHoveredProp ? 'scale(1.02)' : 'scale(1)',
        textDecoration: 'none'
    });

    const signUpLinkStyle = ({ isHoveredProp }) => ({
        backgroundColor: colors.primary,
        color: 'white',
        padding: '0.5rem 1rem',
        marginBottom: '0.1rem',
        transition: 'all 0.3s ease',
        transform: isHoveredProp ? 'scale(1.05)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
    });

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light sticky-top p-0"
            style={{ backgroundColor: colors.light }}
        >
            <style jsx="true">{`
                .cart-badge {
                    background-color: ${colors.primary};
                    color: white;
                    border-radius: 50%;
                    padding: 0.2em 0.5em;
                    font-size: 0.75em;
                    position: absolute;
                    top: -5px;
                    right: -10px;
                    line-height: 1;
                    min-width: 20px;
                    text-align: center;
                }
                .cart-icon-container {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>

            <Link
                to="/"
                className="navbar-brand d-flex align-items-center px-4 px-lg-5"
                style={{ padding: '0.75rem', transition: 'all 0.3s ease' }}
            >
                <h1 className="m-0" style={{ fontSize: '2rem', color: colors.dark }}>☕ COFFEE</h1>
            </Link>

            <button
                type="button"
                className="navbar-toggler me-2"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto d-flex align-items-center">
                    <NavLink
                        to="/"
                        className="nav-item nav-link"
                        style={({ isActive }) => navLinkStyle({ isActive, isHoveredProp: false })}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/menu"
                        className="nav-item nav-link"
                        style={({ isActive }) => navLinkStyle({ isActive, isHoveredProp: false })}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Menu
                    </NavLink>
                    <NavLink
                        to="/about"
                        className="nav-item nav-link"
                        style={({ isActive }) => navLinkStyle({ isActive, isHoveredProp: false })}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/locations"
                        className="nav-item nav-link"
                        style={({ isActive }) => navLinkStyle({ isActive, isHoveredProp: false })}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Locations
                    </NavLink>

                    <div className="nav-item dropdown">
                        <a
                            href="#"
                            className="nav-link dropdown-toggle"
                            data-bs-toggle="dropdown"
                            style={{
                                color: colors.secondary,
                                padding: '0.5rem 1rem',
                                transition: 'all 0.3s ease',
                                transform: isMoreHovered ? 'scale(1.05)' : 'scale(1)',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={() => setIsMoreHovered(true)}
                            onMouseLeave={() => setIsMoreHovered(false)}
                        >
                            More
                        </a>
                        <div className="dropdown-menu m-0" style={{ backgroundColor: colors.light, minWidth: '100px', padding: '0.3rem 0' }}>
                            <NavLink
                                to="/events"
                                className="dropdown-item"
                                style={({ isActive }) => dropdownItemStyle({ isActive, isHoveredProp: false })}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Events
                            </NavLink>
                            <NavLink
                                to="/catering"
                                className="dropdown-item"
                                style={({ isActive }) => dropdownItemStyle({ isActive, isHoveredProp: false })}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Catering
                            </NavLink>
                            <NavLink
                                to="/team"
                                className="dropdown-item"
                                style={({ isActive }) => dropdownItemStyle({ isActive, isHoveredProp: false })}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Our Baristas
                            </NavLink>
                            <NavLink
                                to="/testimonials"
                                className="dropdown-item"
                                style={({ isActive }) => dropdownItemStyle({ isActive, isHoveredProp: false })}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Testimonials
                            </NavLink>
                            <NavLink
                                to="/blog"
                                className="dropdown-item"
                                style={({ isActive }) => dropdownItemStyle({ isActive, isHoveredProp: false })}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Blog
                            </NavLink>
                        </div>
                    </div>
                    <NavLink
                        to="/contact"
                        className="nav-item nav-link"
                        style={({ isActive }) => navLinkStyle({ isActive, isHoveredProp: false })}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Contact
                    </NavLink>

                    <div className="d-flex align-items-center ms-2">
                        <NavLink
                            to="/cart"
                            className="nav-item nav-link d-flex align-items-center cart-icon-container"
                            style={({ isActive }) => navLinkStyle({ isActive, isHoveredProp: false, padding: '0.5rem 0.75rem' })}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className="fa fa-shopping-cart"></i>
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </NavLink>

                        {isLoggedIn ? (
                            <div className="nav-item dropdown">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    style={{
                                        color: colors.secondary,
                                        padding: '0.5rem 0.75rem',
                                        transition: 'all 0.3s ease',
                                        transform: isUserHovered ? 'scale(1.15)' : 'scale(1)',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={() => setIsUserHovered(true)}
                                    onMouseLeave={() => setIsUserHovered(false)}
                                >
                                    <i className="fa fa-user" style={{ fontSize: '1rem' }}></i>
                                </a>
                                <div
                                    className="dropdown-menu dropdown-menu-end m-0"
                                    style={{
                                        backgroundColor: colors.light,
                                        minWidth: '100px',
                                        padding: '0.3rem 0'
                                    }}
                                >
                                    <span className="dropdown-item" style={{ color: colors.dark, cursor: 'default' }}>
                                        {user?.username}
                                    </span>
                                    <button
                                        className="dropdown-item"
                                        style={{ ...dropdownItemStyle({ isHoveredProp: false }), border: 'none', background: 'none', textAlign: 'left', width: '100%' }}
                                        onClick={handleLogout}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="nav-item dropdown">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    style={{
                                        color: colors.secondary,
                                        padding: '0.5rem 0.75rem',
                                        transition: 'all 0.3s ease',
                                        transform: isUserHovered ? 'scale(1.15)' : 'scale(1)',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={() => setIsUserHovered(true)}
                                    onMouseLeave={() => setIsUserHovered(false)}
                                >
                                    <i className="fa fa-user-plus" style={{ fontSize: '1rem' }}></i>
                                </a>
                                <div
                                    className="dropdown-menu dropdown-menu-end m-0"
                                    style={{
                                        backgroundColor: colors.light,
                                        minWidth: '100px',
                                        padding: '0.3rem 0'
                                    }}
                                >
                                    <NavLink
                                        to="/signup"
                                        className="dropdown-item"
                                        style={({ isActive }) => signUpLinkStyle({ isHoveredProp: false })}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Sign Up
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        className="dropdown-item"
                                        style={({ isActive }) => dropdownItemStyle({ isActive, isHoveredProp: false })}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Login
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;

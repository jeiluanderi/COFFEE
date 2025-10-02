import React, { useState, useEffect, useRef } from 'react';
// IMPORT: Now correctly imported, used below

import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    LogOut,
    Coffee, 
    Tags, 
    Users,
    BookOpen,
    ClipboardList,
    UserCheck,
    FileEdit,
    ChevronDown, 
    Mail, 
} from 'lucide-react';

// The Sidebar component remains correct, but is included for completeness.
const Sidebar = ({ currentPage, setCurrentPage, onLogout }) => {
    const [profileOpen, setProfileOpen] = useState(false); 
    const dropdownRef = useRef(null);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
        { name: 'Orders', icon: ShoppingBag, page: 'orders' },
        { name: 'Coffees', icon: Coffee, page: 'coffees' },
        { name: 'Categories', icon: Tags, page: 'categories' },
        { name: 'Team Members', icon: Users, page: 'team-members' },
        { name: 'Blog Posts', icon: BookOpen, page: 'blog-posts' },
        { name: 'Users', icon: UserCheck, page: 'users' },
        { name: 'Inquiries', icon: ClipboardList, page: 'inquiries' },
        { name: 'Content', icon: FileEdit, page: 'content' },
    ];

    // Get admin info from localStorage
    const adminName = localStorage.getItem("username") || "Admin";
    const adminEmail = localStorage.getItem("email") || "admin@example.com";

    // Effect to handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <aside className="sidebar">
            <div>
                <header className="sidebar-header">
                    <h1 className="logo-text">Garden Admin</h1>
                </header>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.page}>
                                <a
                                    href="#"
                                    className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(item.page);
                                        setProfileOpen(false); // Close dropdown on navigation
                                    }}
                                >
                                    <item.icon size={20} className="nav-icon" />
                                    <span className="nav-text">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="profile-section-container" ref={dropdownRef}>
                {/* Clickable profile */}
                <div 
                    className={`user-profile ${profileOpen ? 'active' : ''}`}
                    onClick={() => setProfileOpen(!profileOpen)}
                >
                    <img
                        src={`https://placehold.co/40x40/f7b731/2c2f42?text=${adminName[0].toUpperCase()}`}
                        alt="User Profile"
                        className="user-avatar"
                    />
                    <div className="user-profile-info">
                        <span className="username">{adminName}</span>
                        <span className="role">Administrator</span>
                    </div>
                    <ChevronDown size={16} className={`dropdown-arrow ${profileOpen ? 'rotate' : ''}`} />
                </div>

                {/* Dropdown menu */}
                {profileOpen && (
                    <div className="profile-dropdown">
                        <div className="dropdown-email dropdown-item">
                            <Mail size={16} className="dropdown-icon" />
                            <span>{adminEmail}</span>
                        </div>
                        <button 
                            className="dropdown-item" 
                            onClick={() => {
                                setCurrentPage('settings');
                                setProfileOpen(false);
                            }}
                        >
                            <Settings size={16} className="dropdown-icon" />
                            Settings
                        </button>
                        <button className="dropdown-item logout-dropdown-item" onClick={onLogout}>
                            <LogOut size={16} className="dropdown-icon" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

// ---

const RootLayout = ({ children, currentPage, setCurrentPage, onLogout }) => {
    return (
        // 🚀 FIX: Wrap the entire dashboard component with the PageSettingsProvider.
        // This ensures that any child component rendered via {children}, 
        // like ContentManagementPage, can successfully use the usePageSettings() hook.
      
            <div className="dashboard-container">
                {/* Internal CSS for the admin layout */}
                <style>
                    {`
                    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

                    /* Basic Reset & Font */
                    html, body, #root {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                    }

                    body {
                        font-family: "Inter", sans-serif;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        background-color: #f0f4f8; /* Light gray background for the entire app */
                    }

                    /* Dashboard Container */
                    .dashboard-container {
                        display: flex;
                        min-height: 100vh;
                        background-color: #f0f4f8; 
                        padding: 16px; 
                        box-sizing: border-box; 
                    }

                    .dashboard-card {
                        background-color: white;
                        border-radius: 12px; 
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                        display: flex; /* ADDED: This makes Sidebar and Main Content lay out side-by-side */
                        flex-grow: 1;
                        overflow: hidden; 
                    }

                    /* Sidebar Styles */
                    .sidebar {
                        width: 250px; /* Fixed width */
                        flex-shrink: 0; /* Prevent shrinking */
                        background-color: #36220B; /* Dark coffee bean color */
                        color: white;
                        padding: 24px 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between; 
                        border-radius: 12px 0 0 12px; /* Rounded left corners */
                        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                    }

                    .sidebar-header {
                        text-align: center;
                        margin-bottom: 30px;
                    }

                    .logo-text {
                        font-size: 28px;
                        font-weight: 700;
                        color: #F8F5EB; /* Creamy white */
                        letter-spacing: 1px;
                    }

                    .sidebar-nav ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }

                    .sidebar-nav li {
                        margin-bottom: 8px;
                    }

                    .nav-item {
                        display: flex;
                        align-items: center;
                        padding: 12px 24px;
                        color: rgba(255, 255, 255, 0.8);
                        text-decoration: none;
                        font-weight: 500;
                        transition: all 0.3s ease;
                        border-left: 4px solid transparent;
                    }

                    .nav-item:hover {
                        color: white;
                        background-color: rgba(255, 255, 255, 0.1);
                        border-left-color: #A0522D; /* Lighter brown accent */
                    }

                    .nav-item.active {
                        color: white;
                        background-color: #A0522D; /* Lighter brown for active state */
                        border-left-color: #F7B731; /* Yellow accent */
                        font-weight: 600;
                    }

                    .nav-icon {
                        margin-right: 12px;
                    }

                    /* User Profile & Dropdown Section */
                    .profile-section-container {
                        position: relative;
                        margin-top: auto; /* Pushes the profile section to the bottom */
                        padding-top: 20px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .user-profile {
                        display: flex;
                        align-items: center;
                        padding: 20px 24px;
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                        justify-content: space-between;
                    }

                    .user-profile:hover {
                        background-color: rgba(255, 255, 255, 0.05);
                    }

                    .user-profile.active {
                        background-color: rgba(255, 255, 255, 0.1);
                    }

                    .user-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-right: 12px;
                        border: 2px solid #F7B731;
                    }

                    .user-profile-info {
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                    }

                    .username {
                        font-weight: 600;
                        color: white;
                    }

                    .role {
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.7);
                    }
                    
                    .dropdown-arrow {
                        transition: transform 0.3s ease;
                    }

                    .dropdown-arrow.rotate {
                        transform: rotate(180deg);
                    }

                    /* Dropdown Menu */
                    .profile-dropdown {
                        position: absolute;
                        bottom: 100%; /* Position above the profile container */
                        left: 24px;
                        right: 24px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                        margin-bottom: 10px; /* Space between dropdown and profile */
                        padding: 8px;
                        z-index: 100;
                        display: flex;
                        flex-direction: column;
                    }

                    .dropdown-item {
                        display: flex;
                        align-items: center;
                        padding: 10px 12px;
                        color: #36220B;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 500;
                        transition: background-color 0.2s ease;
                        cursor: pointer;
                        border: none;
                        background: none;
                        width: 100%;
                        text-align: left;
                    }
                    
                    .dropdown-item:hover {
                        background-color: #f0f4f8;
                    }
                    
                    .dropdown-item .dropdown-icon {
                        color: #A0522D;
                        margin-right: 10px;
                    }
                    
                    .dropdown-email {
                        color: #6c757d;
                        font-size: 13px;
                        font-weight: 400;
                        cursor: default;
                        border-bottom: 1px solid #e9ecef;
                        margin-bottom: 8px;
                        padding-bottom: 12px;
                    }
                    
                    .dropdown-email:hover {
                        background-color: white; /* Prevent hover effect on email */
                    }

                    .logout-dropdown-item {
                        color: #dc3545;
                    }
                    
                    .logout-dropdown-item:hover {
                        background-color: #f8d7da;
                    }
                    
                    .logout-dropdown-item .dropdown-icon {
                        color: #dc3545;
                    }

                    /* Main Content Area */
                    .main-content {
                        flex-grow: 1;
                        padding: 24px;
                        background-color: #f8f9fa; /* Lighter background for content */
                        border-radius: 0 12px 12px 0; /* Rounded right corners */
                        overflow-y: auto; /* Enable scrolling for content */
                    }
                    `}
                </style>
                <div className="dashboard-card">
                    <Sidebar
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        onLogout={onLogout}
                    />
                    {/* WRAPPED CHILDREN in a div with the main-content class */}
                    <div className="main-content">
                        {children}
                    </div>
                </div>
            </div>
        
    );
};

export default RootLayout;
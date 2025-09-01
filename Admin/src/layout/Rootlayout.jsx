import React from 'react';
import {
    LayoutDashboard,
    Menu,
    ShoppingBag,
    Table,
    Wallet,
    Settings,
    LogOut,
    Coffee, // For Coffees/Menu Items
    Tags, // For Categories
    Users, // For Team Members (Baristas) and User Management
    BookOpen, // For Blog Posts
    ClipboardList, // For Inquiries
    UserCheck, // More specific for User Management
} from 'lucide-react';
// import '../index.css'; // Removed: Styles are now internal

const Sidebar = ({ currentPage, setCurrentPage, onLogout }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
        { name: 'Orders', icon: ShoppingBag, page: 'orders' },
        { name: 'Coffees', icon: Coffee, page: 'coffees' },
        { name: 'Categories', icon: Tags, page: 'categories' },
        { name: 'Team Members', icon: Users, page: 'team-members' },
        { name: 'Blog Posts', icon: BookOpen, page: 'blog-posts' },
        { name: 'Users', icon: UserCheck, page: 'users' },
        { name: 'Inquiries', icon: ClipboardList, page: 'inquiries' },
        { name: 'Settings', icon: Settings, page: 'settings' },
    ];

    // Get admin name from localStorage
    const adminName = localStorage.getItem("username") || "Admin";

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
            <div>
                {/* Dynamic admin info */}
                <div className="user-profile">
                    <img
                        src={`https://placehold.co/40x40/f7b731/2c2f42?text=${adminName[0].toUpperCase()}`}
                        alt="User Profile"
                        className="user-avatar"
                    />
                    <div className="user-profile-info">
                        <span className="username">{adminName}</span>
                        <span className="role">Administrator</span>
                    </div>
                </div>

                <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={20} className="logout-icon" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

const RootLayout = ({ children, currentPage, setCurrentPage, onLogout }) => {
    return (
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
                    background-color: #f0f4f8; /* Consistent background */
                    padding: 16px; /* Decreased padding */
                    box-sizing: border-box; /* Include padding in element's total width and height */
                }

                .dashboard-card {
                    background-color: white;
                    border-radius: 12px; /* Smaller border-radius */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-grow: 1;
                    overflow: hidden; /* Ensure content within card is contained */
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
                    justify-content: space-between; /* Push logout to bottom */
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

                /* User Profile */
                .user-profile {
                    display: flex;
                    align-items: center;
                    padding: 20px 24px;
                    margin-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 20px;
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
                }

                .username {
                    font-weight: 600;
                    color: white;
                }

                .role {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.7);
                }

                /* Logout Button */
                .logout-btn {
                    width: calc(100% - 48px); /* Full width minus padding */
                    margin: 20px 24px 24px 24px; /* Adjust margin */
                    padding: 12px 15px;
                    background-color: #dc3545; /* Red for logout */
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s ease;
                }

                .logout-btn:hover {
                    background-color: #c82333;
                }

                .logout-icon {
                    margin-right: 8px;
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
                {children}
            </div>
        </div>
    );
};

export default RootLayout;

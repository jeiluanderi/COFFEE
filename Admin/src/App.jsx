import React, { useState } from 'react';
import RootLayout from '../src/layout/Rootlayout';
import DashboardPage from './pages/DashboardPage';
// import MenuPage from './pages/MenuPage'; // This is likely for the public site, not admin management
import OrdersPage from './pages/OrdersPage';
import AccountingPage from './pages/AccountingPage';
// import TablePage from './pages/TablePage'; // Assuming this is general data, not specific to tables in a restaurant sense
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import './index.css';

// Import new admin pages (we will create these as placeholders)
import AdminCoffeesPage from './pages/AdminCoffeesPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminTeamMembersPage from './pages/AdminTeamMembersPage';
import AdminBlogPostsPage from './pages/AdminBlogPostsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminInquiriesPage from './pages/AdminInquiriesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem("token")); // <-- stateful token

  const handleLogin = (authToken) => {
    // Save token received from LoginPage component
    localStorage.setItem("token", authToken);
    setToken(authToken); // Update state so React re-renders
    setCurrentPage("dashboard"); // Send user to dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // Clear username on logout
    localStorage.removeItem("userRole"); // Clear user role on logout
    setToken(null); // Update state so React re-renders
    setCurrentPage('dashboard'); // Redirect to dashboard or login
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'orders':
        return <OrdersPage />;
      case 'coffees':
        return <AdminCoffeesPage />; // New page
      case 'categories':
        return <AdminCategoriesPage />; // New page
      case 'team-members':
        return <AdminTeamMembersPage />; // New page
      case 'blog-posts':
        return <AdminBlogPostsPage />; // New page
      case 'users':
        return <AdminUsersPage />; // New page
      case 'inquiries':
        return <AdminInquiriesPage />; // New page
      case 'accounting':
        return <AccountingPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      {token ? (
        <RootLayout
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        >
          {renderPage()}
        </RootLayout>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;

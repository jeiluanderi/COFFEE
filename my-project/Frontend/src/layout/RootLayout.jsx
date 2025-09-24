import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageHeader from '../components/Shared/PageHeader'; // Adjust the path as needed
// Assuming you have other components like Navbar and Footer
import Topbar from '../components/Index/Topbar';
import Header from '../components/Index/Header';
import Footer from '../components/Index/Footer';
import spinner from '../components/Shared/Spinner';

const RootLayout = () => {
  const location = useLocation();

  // Helper function to map pathnames to human-readable names
  const getPageName = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Home';
      case '/about':
        return 'About Us';
      case '/services':
        return 'Services';
      case '/menu':
        return 'Menu';
      case '/locations':
        return 'Locations';
      case '/events':
        return 'Events';
      case '/catering':
        return 'Catering';
      case '/team':
        return 'Our Team';
      case '/testimonials':
        return 'Testimonials';
      case '/blog':
        return 'Blog';
      case '/contact':
        return 'Contact';
      case '/cart':
        return 'Cart';
      case '/signup':
        return 'Sign Up';
      case '/login':
        return 'Log In';
      default:
        // This case handles any path that doesn't match a defined route
        return '404 Not Found';
    }
  };

  const activePage = getPageName(location.pathname);
  const title = activePage; // Use the same value for the main title

  // Do not render the PageHeader on the Home page or the 404 page
  const shouldRenderHeader = location.pathname !== '/' && activePage !== '404 Not Found';

  return (
    <>
      <spinner />
      <Topbar />
      {< Header />}
      {shouldRenderHeader && <PageHeader title={title} activePage={activePage} />}
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
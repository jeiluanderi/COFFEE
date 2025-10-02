import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageHeader from '../components/Shared/PageHeader'; 
import Topbar from '../components/Index/Topbar';
import Header from '../components/Index/Header';
import Footer from '../components/Index/Footer';

const RootLayout = () => {
    const location = useLocation();

    // Map pathnames to page titles and pageKeys
    const pageConfig = {
        '/': { title: 'Home', pageKey: null }, // Home page doesn't need PageHeader
        '/about': { title: 'About Us', pageKey: 'about_page_header' },
        '/services': { title: 'Our Offerings', pageKey: 'services_page_header' },
        '/menu': { title: 'Discover Our Menu', pageKey: 'menu_page_header' },
        '/locations': { title: 'Find Us', pageKey: 'locations_page_header' },
        '/events': { title: 'Upcoming Events', pageKey: 'events_page_header' },
        '/catering': { title: 'Catering Services', pageKey: 'catering_page_header' },
        '/team': { title: 'Meet Our Team', pageKey: 'team_page_header' },
        '/testimonials': { title: 'Customer Love', pageKey: 'testimonials_page_header' },
        '/blog': { title: 'Our Blog', pageKey: 'blog_page_header' },
        '/contact': { title: 'Get In Touch', pageKey: 'contact_page_header' },
        '/cart': { title: 'Your Cart', pageKey: 'cart_page_header' },
        '/signup': { title: 'Create Account', pageKey: 'signup_page_header' },
        '/login': { title: 'Account Login', pageKey: 'login_page_header' },
        '/admin/page-headers': { title: 'Admin Settings', pageKey: null }, // Admin page doesn't need header
    };

    const { title, pageKey } = pageConfig[location.pathname] || { title: '404 Not Found', pageKey: 'error_page_header' };

    // Only render PageHeader if pageKey exists
    const shouldRenderHeader = !!pageKey;

    return (
        <>
            <Topbar />
            <Header />

            {shouldRenderHeader && <PageHeader title={title} pageKey={pageKey} />}

            <Outlet />
            <Footer />
        </>
    );
};

export default RootLayout;

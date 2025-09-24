import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import Home from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/ServicesPage';
import MenuPage from './pages/MenuPage'; // Ensure file is named MenuPage.jsx
import LocationsPage from './pages/LocationsPage'; // Ensure file is named LocationsPage.jsx
import EventsPage from './pages/EventsPage'; // Ensure file is named EventsPage.jsx
import CateringPage from './pages/CateringPage'; // Ensure file is named CateringPage.jsx
import TeamPage from './pages/TeamPage'; // Ensure file is named TeamPage.jsx
import TestimonialPage from './pages/TestimonialPage'; // Ensure file is named TestimonialPage.jsx
import BlogPage from './pages/BlogPage'; // Corrected import name for consistency (assuming BlogPage.jsx)
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage'; // Corrected import name for consistency (assuming CartPage.jsx)
import SignupPage from './pages/SignupPage'; // Corrected import name for consistency (assuming SignupPage.jsx)
import LoginPage from './pages/LoginPage'; // Corrected import name for consistency (assuming LoginPage.jsx)
import Error404page from './pages/Error404page'; // Uncommented and imported
// import ProtectedRoute from './components/shared/ProtectedRoute';
// Import Providers
import { CartProvider } from './context/CartContext.jsx'; // Make sure CartContext.jsx exists
import { AuthProvider } from './context/AuthContext.jsx'; // Make sure AuthContext.jsx exists


function App() {
  return (
    // AuthProvider should wrap CartProvider, and CartProvider should wrap Routes.
    // This ensures all nested components have access to both Auth and Cart contexts.
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path='/' element={<RootLayout />} >
            <Route index element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services"element={<ServicesPage/>}   />
            <Route path="/menu" element={<MenuPage />} /> {/* Route path now lowercase */}
            <Route path="/locations" element={<LocationsPage />} /> {/* Route path now lowercase */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/catering" element={<CateringPage />} /> {/* Route path now lowercase */}
            <Route path="/team" element={<TeamPage />} /> {/* Route path now lowercase */}
            <Route path="/testimonials" element={<TestimonialPage />} /> {/* Route path now lowercase */}
            <Route path="/blog" element={<BlogPage />} /> {/* Corrected route path to lowercase /blog */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Routes for Cart and Authentication Pages */}
            <Route path="/cart" element={<CartPage />} />

            {/* <-- 2. WRAP THE PAGE */}




            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* The catch-all route for 404 errors should ALWAYS be the LAST one 
                within its parent <Route> or <Routes> to ensure other routes are matched first. */}
            <Route path="*" element={<Error404page />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
// import PageHeader from '../components/Shared/PageHeader'; // Assuming PageHeader is in shared
import Spinner from '../components/Shared/Spinner';     // Assuming Spinner is in shared
import MenuSection from '../components/Menu/MenuSection'; // Assuming MenuSection component exists

const MenuPage = () => {
    const [loading, setLoading] = useState(true);
    const [coffees, setCoffees] = useState([]);         // State to store fetched coffee products
    const [categories, setCategories] = useState([]);   // State to store fetched categories
    const [error, setError] = useState(null);           // State to store any fetch errors

    // Define color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    // useEffect to handle data fetching when the component mounts
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                // Fetch coffees data from the backend
                const coffeesResponse = await fetch('http://localhost:3001/api/coffees');
                if (!coffeesResponse.ok) {
                    // If the response is not OK (e.g., 404, 500), throw an error
                    throw new Error(`HTTP error! status: ${coffeesResponse.status}`);
                }
                const coffeesData = await coffeesResponse.json(); // Parse the JSON response
                setCoffees(coffeesData); // Update state with fetched coffees

                // Fetch categories data from the backend
                const categoriesResponse = await fetch('http://localhost:3001/api/categories');
                if (!categoriesResponse.ok) {
                    // If the response is not OK, throw an error
                    throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
                }
                const categoriesData = await categoriesResponse.json(); // Parse the JSON response
                setCategories(categoriesData); // Update state with fetched categories

            } catch (err) {
                // Catch any errors during the fetch process
                console.error("Failed to fetch menu data:", err);
                setError("Failed to load menu items. Please ensure your backend server is running and accessible.");
            } finally {
                // Always set loading to false after fetch attempts (success or failure)
                setLoading(false);
            }
        };

        fetchMenuData(); // Call the fetch function
    }, []); // Empty dependency array means this useEffect runs only once on component mount

    // Conditional rendering based on loading and error states
    if (loading) {
        return <Spinner />; // Show spinner while data is being fetched
    }

    if (error) {
        // Display an error message if data fetching failed
        return (
            <div className="container-xxl py-5 text-center" style={{ backgroundColor: colors.light, color: colors.dark }}>
                <p className="display-6">{error}</p>
                <p>Please check your network connection and ensure the backend server is operational.</p>
            </div>
        );
    }

    return (
        <>
            {/* PageHeader component for the menu page */}
            {/* <PageHeader title="Our Menu" activePage="Menu" /> */}
            {/* MenuSection component receives fetched coffees and categories as props */}
            <MenuSection coffees={coffees} categories={categories} />
        </>
    );
};

export default MenuPage;

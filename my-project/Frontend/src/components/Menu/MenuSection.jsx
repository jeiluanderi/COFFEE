import React, { useState, useEffect, useContext } from 'react'; // Import useEffect
import { CartContext } from '../../context/CartContext.jsx'; // Correct import path for CartContext
import Spinner from '../Shared/Spinner.jsx'; // Assuming Spinner is in shared components

// Define a mapping for default icons based on category if not provided by backend
const categoryIconMap = {
    'espresso': 'fas fa-coffee',
    'latte': 'fas fa-mug-hot',
    'cappuccino': 'fas fa-mug-hot',
    'cold drinks': 'fas fa-glass-whiskey', // Corrected to match "Cold Drinks" from categories
    'pastries': 'fas fa-cookie-bite',
    'food': 'fas fa-sandwich',
    'tea': 'fas fa-leaf', // Changed to leaf for tea
    'smoothies': 'fas fa-blender',
    'brewed coffee': 'fas fa-coffee',
    'other': 'fas fa-utensils',
};

// Reusable Menu Item Card Component
const MenuItemCard = ({ item, addToCart, categoryName, delay = '0.1s' }) => {
    const { id, name, description, price, image_url } = item;
    // Fallback image if no imageUrl is provided from the backend
    const defaultImg = 'https://placehold.co/400x250/F5EFE6/6F4E37?text=Coffee'; // Generic coffee placeholder
    const displayImg = image_url || defaultImg;

    // Determine icon - prioritize category-specific or a default
    const iconClass = categoryIconMap[categoryName ? categoryName.toLowerCase() : 'other'] || categoryIconMap['other'];

    // Define colors for consistency within the card's style
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    const handleAddToCart = () => {
        // Price should already be a number due to pg parser. Added parseFloat as an extra safeguard.
        const itemWithNumericPrice = {
            ...item,
            price: parseFloat(item.price) || 0 // Ensure price is a number
        };
        addToCart(itemWithNumericPrice); // Call addToCart from context
    };

    return (
        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={delay}>
            <style jsx="true">{`
                .service-img {
                    height: 200px;
                    overflow: hidden;
                }
                .service-img img {
                    object-fit: cover;
                }
                .menu-icon-container {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--color-light);
                    border-radius: 50%;
                }
                .service-item {
                    box-shadow: 0 0 45px rgba(0,0,0,.08);
                    border-radius: 8px;
                    background-color: white;
                    transition: transform 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .service-item:hover {
                    transform: translateY(-5px);
                }
                .service-text {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .service-text h4 {
                    color: ${colors.dark};
                }
                .service-text p {
                    color: ${colors.secondary};
                }
                .service-text .text-primary {
                    color: ${colors.primary} !important;
                }
                .add-to-cart-button {
                    background-color: ${colors.primary};
                    color: white;
                    border: none;
                    padding: 0.6rem 1rem;
                    border-radius: 5px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }
                .add-to-cart-button:hover {
                    background-color: ${colors.dark};
                    transform: scale(1.02);
                }
            `}</style>
            <div className="service-item rounded d-flex flex-column">
                <div className="service-img rounded-top">
                    <img className="img-fluid w-100 h-100" src={displayImg} alt={name} onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }} />
                </div>
                <div className="service-text rounded-bottom p-4 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex align-items-center mb-3">
                            <div className="btn-square rounded-circle bg-light me-3 menu-icon-container">
                                <i className={`${iconClass} fa-2x text-primary`}></i>
                            </div>
                            <div>
                                <h4 className="mb-0">{name}</h4>
                                <p className="mb-0 text-muted">{description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <h5 className="text-primary mb-0">${(parseFloat(price) || 0).toFixed(2)}</h5>
                        <button className="add-to-cart-button" onClick={handleAddToCart}>
                            Order now <i className="fa fa-plus-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Menu Section Component
const MenuSection = () => {
    const [coffees, setCoffees] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const { addItem } = useContext(CartContext);

    // Fetch coffees and categories from backend
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const [coffeesResponse, categoriesResponse] = await Promise.all([
                    fetch('http://localhost:3001/api/coffees'),
                    fetch('http://localhost:3001/api/categories')
                ]);

                if (!coffeesResponse.ok) throw new Error('Failed to fetch coffees');
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');

                const coffeesData = await coffeesResponse.json();
                const categoriesData = await categoriesResponse.json();

                setCoffees(coffeesData);
                setCategories(categoriesData);
            } catch (err) {
                console.error("Error fetching menu data:", err);
                setError("Failed to load menu items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    // Helper to get category name for display, given the category ID
    const getCategoryName = (categoryId) => {
        if (!categories || !Array.isArray(categories)) {
            return 'Uncategorized';
        }
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    // Filter coffees based on the activeFilter
    const filteredCoffees = activeFilter === 'all'
        ? (coffees || [])
        : (coffees || []).filter(coffee => getCategoryName(coffee.category_id).toLowerCase() === activeFilter.toLowerCase());

    // Define colors for CSS variables
    const colors = {
        primary: '#8B4513',
        secondary: '#6F4E37',
        light: '#F8F5EB',
        dark: '#36220B'
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="container-xxl py-5">
                <div className="text-center p-5 rounded" style={{ backgroundColor: colors.light, color: 'red' }}>
                    <p className="lead">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xxl py-5">
            <style jsx="true">{`
                :root {
                    --color-primary: ${colors.primary};
                    --color-secondary: ${colors.secondary};
                    --color-light: ${colors.light};
                    --color-dark: ${colors.dark};
                }
                #menu-filters {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    padding: 0;
                    margin: 0;
                    list-style: none;
                }
                #menu-filters li {
                    cursor: pointer;
                    padding: 10px 20px;
                    margin: 5px;
                    font-weight: 600;
                    border: 1px solid var(--color-secondary);
                    border-radius: 25px;
                    color: var(--color-secondary);
                    transition: all 0.3s ease;
                }
                #menu-filters li.active,
                #menu-filters li:hover {
                    background-color: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                    transform: translateY(-2px);
                }
            `}</style>
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Full Menu</p>
                    <h1 className="display-5 mb-5">Explore Our Delicious Coffee & Bites</h1>
                </div>

                <div className="row wow fadeInUp" data-wow-delay="0.3s">
                    <div className="col-12 text-center mb-5">
                        <ul className="list-inline rounded" id="menu-filters">
                            <li
                                className={activeFilter === 'all' ? 'mx-2 active' : 'mx-2'}
                                onClick={() => setActiveFilter('all')}
                            >
                                All
                            </li>
                            {categories && Array.isArray(categories) && categories.map(category => (
                                <li
                                    key={category.id}
                                    className={activeFilter === category.name.toLowerCase() ? 'mx-2 active' : 'mx-2'}
                                    onClick={() => setActiveFilter(category.name.toLowerCase())}
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="row g-4">
                    {filteredCoffees && filteredCoffees.length > 0 ? (
                        filteredCoffees.map((item, index) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                addToCart={addItem} // Pass addItem from CartContext directly
                                categoryName={getCategoryName(item.category_id)}
                                delay={`${0.1 + (index % 3) * 0.2}s`}
                            />
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="fs-4 text-muted">No menu items found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuSection;

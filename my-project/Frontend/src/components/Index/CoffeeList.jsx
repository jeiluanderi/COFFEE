// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Spinner from '../shared/Spinner';
// import '../../styles/CoffeeProduct.css';

// const CoffeeList = () => {
//     const [coffees, setCoffees] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedCategory, setSelectedCategory] = useState('View All');

//     // Pagination State
//     const [currentPage, setCurrentPage] = useState(1);
//     const coffeesPerPage = 9; // Number of items per page

//     useEffect(() => {
//         const fetchCoffees = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3001/api/coffees');
//                 setCoffees(response.data);
//             } catch (err) {
//                 console.error('Error fetching coffees:', err);
//                 setError('Failed to load coffee products. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCoffees();
//     }, []);

//     // A new useEffect to reset pagination when the category changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [selectedCategory]);

//     if (loading) {
//         return <Spinner />;
//     }

//     if (error) {
//         return (
//             <div className="error-message">
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     // Filter the coffees first based on the selected category
//     const getFilteredCoffees = () => {
//         if (selectedCategory === 'View All') {
//             return coffees;
//         }
//         return coffees.filter(coffee => coffee.category === selectedCategory);
//     };

//     const filteredCoffees = getFilteredCoffees();
//     const categories = ['View All', 'Espresso', 'Drip Coffee', 'Cold Brew', 'Specialty'];

//     // Pagination Logic: Slicing the filtered array
//     const indexOfLastCoffee = currentPage * coffeesPerPage;
//     const indexOfFirstCoffee = indexOfLastCoffee - coffeesPerPage;
//     const currentCoffees = filteredCoffees.slice(indexOfFirstCoffee, indexOfLastCoffee);

//     const totalPages = Math.ceil(filteredCoffees.length / coffeesPerPage);

//     return (
//         <div className="coffee-list-container">
//             {/* Category Tabs */}
//             <div className="category-tabs">
//                 {categories.map((category) => (
//                     <button
//                         key={category}
//                         onClick={() => setSelectedCategory(category)}
//                         className={`category-tab-button ${selectedCategory === category ? 'active' : ''}`}
//                     >
//                         {category}
//                     </button>
//                 ))}
//             </div>

//             <h2 className="selected-category-title">{selectedCategory}</h2>

//             {/* Coffee Grid */}
//             <div className="coffee-grid">
//                 {currentCoffees.length > 0 ? (
//                     currentCoffees.map((coffee) => (
//                         <div key={coffee.id} className="coffee-item-card">
//                             <img
//                                 src={coffee.image_url || `https://placehold.co/400x300/e0e0e0/000000?text=${encodeURIComponent(coffee.name)}`}
//                                 alt={coffee.name}
//                                 className="coffee-product-image"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = `https://placehold.co/400x300/e0e0e0/000000?text=Image+Missing`;
//                                 }}
//                             />
//                             <div className="coffee-item-details">
//                                 <h3 className="coffee-item-name">{coffee.name}</h3>
//                                 <p className="coffee-item-description">
//                                     {coffee.description || 'A rich and aromatic coffee experience.'}
//                                 </p>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="no-products-message">No coffee products found in this category.</p>
//                 )}
//             </div>

//             {/* Pagination Dots */}
//             {totalPages > 1 && (
//                 <div className="pagination-dots-container">
//                     {[...Array(totalPages)].map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => setCurrentPage(index + 1)}
//                             className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
//                         ></button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CoffeeList;
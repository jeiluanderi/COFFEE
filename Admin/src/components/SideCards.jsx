import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const SideCards = () => {
    const [popularDishes, setPopularDishes] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular dishes
                const popularResponse = await axios.get('https://localhost:3001/api/menu/popular');
                setPopularDishes(popularResponse.data);

                // Fetch out-of-stock items
                const outOfStockResponse = await axios.get('https://localhost:3001/api/menu/out-of-stock');
                setOutOfStock(outOfStockResponse.data);

            } catch (error) {
                console.error("Error fetching side card data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="card">
                <div className="list-header">
                    <h3>Popular Dishes</h3>
                    <a href="#">View All</a>
                </div>
                <ul className="item-list">
                    {popularDishes.map((dish, index) => (
                        <li key={index} className="dish-item">
                            <span className="rank">{index + 1}</span>
                            <img src={dish.image || `https://placehold.co/40x40/f0f4f8/94a3b8?text=${index + 1}`} alt={dish.name} />
                            <div className="item-details">
                                <h4>{dish.name}</h4>
                                <span>Orders: {dish.orders}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
                <div className="list-header">
                    <h3>Out of Stock</h3>
                    <a href="#">View All</a>
                </div>
                <ul className="item-list">
                    {outOfStock.map((item, index) => (
                        <li key={index} className="out-of-stock-item">
                            <h4>{item.name}</h4>
                            <span>Available: {item.available}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideCards;

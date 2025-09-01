import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2 } from 'lucide-react';
import '../index.css';

const OrderList = ({ updateTrigger, onOrderDeleted, onOrderUpdated }) => {
    // State to hold the fetched orders
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Function to fetch data from the backend API
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:3001/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [updateTrigger]); // The useEffect now depends on the updateTrigger prop

    // Function to handle status change and send a PUT request to the backend
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:3001/api/orders/${orderId}`, {
                status: newStatus
            });
            // Call the parent function to trigger a full re-fetch
            if (onOrderUpdated) {
                onOrderUpdated();
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // Function to handle order deletion and send a DELETE request to the backend
    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:3001/api/orders/${orderId}`);
            // Call the parent function to trigger a full re-fetch
            if (onOrderDeleted) {
                onOrderDeleted();
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="card loading-state">Loading orders...</div>;
    }

    return (
        <div className="card order-list">
            <div className="list-header">
                <h3>Orders</h3>
                <div className="search-box">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search a customer"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ul className="item-list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <li key={order.id} className="list-item">
                            <div className="item-info">
                                <div className="item-id-badge">{order.id}</div>
                                <div className="item-details">
                                    <h4>{order.customer_name}</h4>
                                    <span>{order.items} items</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className={`status-badge ${order.status
                                        .toLowerCase()
                                        .replace(' ', '-')}`}
                                >
                                    <option value="In Progress">In Progress</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="delete-btn"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-item no-results">No orders found.</li>
                )}
            </ul>
        </div>
    );
};

export default OrderList;
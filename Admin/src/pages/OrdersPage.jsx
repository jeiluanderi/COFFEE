import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component for a styled pill-shaped status badge
const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'ready':
                return 'status-ready';
            case 'in progress':
                return 'status-in-progress';
            case 'pending':
                return 'status-pending';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-default';
        }
    };
    return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>;
};

// Component for a styled pill-shaped payment badge
const PaymentBadge = ({ status }) => {
    const getClass = (s) => {
        switch (s?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700';
            case 'unpaid':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getDisplayText = (s) => {
        if (!s) return 'N/A';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return (
        <span className={`payment-badge ${getClass(status)}`}>
            {getDisplayText(status)}
        </span>
    );
};

// Main Orders Page Component
const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const backendUrl = 'http://localhost:3001';

    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/orders`, { headers: getAuthHeaders() });
                const normalizedOrders = response.data.map(order => ({
                    _id: order.id,
                    customerName: order.customer_name,
                    totalAmount: parseFloat(order.total_price),
                    status: order.status,
                    paymentStatus: order.payment_status,
                    items: order.items || [],
                }));
                setOrders(normalizedOrders);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError('Failed to load orders. Please check your backend connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [backendUrl]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(
                `${backendUrl}/api/orders/${orderId}`,
                { status: newStatus },
                { headers: getAuthHeaders() }
            );
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            showMessage(`Order ${orderId} status updated to ${newStatus}.`, 'success');
        } catch (err) {
            console.error(`Failed to update order status for order ${orderId}:`, err);
            showMessage(`Failed to update order status.`, 'error');
        }
    };
    
    // Delete an order (only works if status = rejected)
    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(`${backendUrl}/api/orders/${orderId}`, {
                headers: getAuthHeaders(),
            });
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            showMessage(`Order ${orderId} deleted successfully.`, 'success');
        } catch (err) {
            console.error(`Failed to delete order ${orderId}:`, err);
            showMessage(`Failed to delete order.`, 'error');
        }
    };

    const filteredOrders = orders.filter(order => {
        const search = searchTerm.toLowerCase();
        return (
            order.customerName?.toLowerCase().includes(search) ||
            order._id?.toString().toLowerCase().includes(search) ||
            order.status?.toLowerCase().includes(search) ||
            order.paymentStatus?.toLowerCase().includes(search)
        );
    });
    console.log("SearchTerm:", searchTerm, "Results:", filteredOrders);


    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const detailsVariants = {
        hidden: { height: 0, opacity: 0, scaleY: 0.9 },
        visible: {
            height: 'auto',
            opacity: 1,
            scaleY: 1,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
    };

    const pageStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');

        :root {
            --primary-color: #6F4E37;
            --secondary-color: #A88F7B;
            --background-color: #F8F5EB;
            --card-background: #FFFFFF;
            --text-dark: #36220B;
            --text-light: #6F4E37;
            --shadow-light: rgba(0, 0, 0, 0.05);
            --shadow-medium: rgba(0, 0, 0, 0.1);
            --border-color: #e0e0e0;
        }

        .orders-page-container {
            flex-grow: 1;
            padding: 1rem 1.5rem;
            box-sizing: border-box;
            background-color: var(--background-color);
            color: var(--text-dark);
            min-height: 100vh;
        }

        .orders-page-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
      .page-header {
    display: flex;
    flex-direction: column; /* Stack children vertically */
    align-items: flex-start; /* Align children to the left */
    margin-bottom: 2rem;
    max-width: 1200px; /* Keep this to align with main content */
    margin: 0 auto 2rem; /* Keep this for centering */
}

.search-container {
    position: relative;
    width: 100%; /* The search bar will now take up the full width */
    max-width: 400px; /* Optional: Keep a maximum width for aesthetics */
    margin-top: 1rem; /* Add some space between the title and the search bar */
}

/* Optional: Adjust the title if needed */
.page-title {
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0;
}
        .delete-button {
           padding: 0.5rem 1rem;
           border: none;
           border-radius: 6px;
           background-color: #dc3545;
           color: white;
           font-weight: 600;
           cursor: pointer;
           transition: background-color 0.2s ease;
           margin-left: 0.5rem;
        }

         .delete-button:hover {
              background-color: #b02a37;
          }
    
       


        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #a0a0a0;
        }

        .search-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 3rem;
            border-radius: 9999px;
            border: 1px solid var(--border-color);
            font-family: 'Open Sans', sans-serif;
            transition: all 0.3s ease;
            outline: none;
        }

        .search-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(111, 78, 55, 0.2);
        }

        .orders-card {
            background: var(--card-background);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 5px 15px var(--shadow-light);
            border: 1px solid var(--border-color);
        }

        .card-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
        }

        .loading-state, .error-state, .no-results {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 200px;
            font-family: 'Open Sans', sans-serif;
            font-size: 1.1rem;
            color: var(--text-light);
            text-align: center;
        }

        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-state {
            color: #dc3545;
        }

        .orders-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .order-summary.header {
            display: grid;
            grid-template-columns: 0.8fr 1.5fr 1fr 1fr 1fr 0.5fr;
            gap: 1.5rem;
            align-items: center;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            background-color: #f5f0e6;
            color: var(--text-dark);
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            box-shadow: inset 0 -1px 0 var(--border-color);
        }
        
        .order-summary.header h4 {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-dark);
            text-transform: uppercase;
            margin: 0;
        }

        .order-item {
            background-color: var(--card-background);
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .order-item:hover {
            background-color: #fbf9f5;
        }

        .order-summary {
            display: grid;
            grid-template-columns: 0.8fr 1.5fr 1fr 1fr 1fr 0.5fr;
            gap: 1.5rem;
            align-items: center;
            padding: 1rem 1.5rem;
        }
        
        .order-detail-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            min-width: 0;
        }
        
        .order-detail-group p {
            font-family: 'Open Sans', sans-serif;
            font-size: 1rem;
            color: var(--text-dark);
            font-weight: 500;
            margin: 0;
        }
        
        .order-detail-group span {
            font-family: 'Open Sans', sans-serif;
            font-size: 0.9rem;
            color: var(--text-light);
        }
        
        .order-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
            align-items: center;
            margin-top: 0.5rem;
        }
        
        .status-badge, .payment-badge {
            padding: 6px 16px;
            border-radius: 25px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
        }
        
        .status-ready {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-in-progress {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .status-pending {
            background-color: #cce5ff;
            color: #004085;
        }
        
        .status-rejected {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .status-default {
            background-color: #e2e3e5;
            color: #383d41;
        }
        
        .message-box {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-weight: 500;
            text-align: center;
        }
        
        .message-box.success {
            background-color: #d4edda;
            color: #155724;
        }
        
        .order-details-container {
            margin-top: 1rem;
            border-top: 1px solid #e0e0e0;
            padding-top: 1rem;
            font-family: 'Open Sans', sans-serif;
        }

        .order-details-container h4 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: var(--primary-color);
        }

        .items-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px dashed #e0e0e0;
        }
        
        .item-row:last-child {
            border-bottom: none;
        }

        .item-name {
            font-weight: 500;
            color: var(--text-dark);
        }

        .item-price {
            font-weight: 600;
            color: var(--text-light);
        }
        
        .pagination-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2rem;
            gap: 0.5rem;
        }

        .pagination-button {
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            border: 1px solid #e0e0e0;
            background-color: var(--card-background);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .pagination-button:hover {
            background-color: var(--background-color);
            border-color: var(--primary-color);
        }

        .pagination-button.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .pagination-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .status-dropdown {
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-family: 'Open Sans', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
        }
        
        /* Responsive Design */
        @media (max-width: 900px) {
            .page-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .search-container {
                max-width: 100%;
                margin-top: 1rem;
            }
            .order-summary {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            .order-actions {
                justify-self: stretch;
                grid-column: 1 / -1;
                margin-top: 0.5rem;
            }
            .order-summary.header {
                display: none;
            }
        }
    `;

    return (
        <div className="orders-page-container">
            <style>{pageStyles}</style>
            <div className="orders-page-content">
                <div className="page-header">
                    <h2 className="page-title">Orders</h2>
                    <div className="search-container">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                {message.text && (
                    <motion.div
                        className={`message-box ${message.type}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {message.text}
                    </motion.div>
                )}
                <div className="orders-card">
                    <h3 className="card-title">Latest Orders</h3>
                    {filteredOrders.length > 0 && !isLoading && !error && (
                        <div className="order-summary header">
                            <h4>Order ID</h4>
                            <h4>Customer Name</h4>
                            <h4>Total Amount</h4>
                            <h4>Payment</h4>
                            <h4>Status</h4>
                            <h4>Actions</h4> {/* Changed "Details" to "Actions" for clarity */}
                        </div>
                    )}
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                        </div>
                    ) : filteredOrders.length > 0 ? ( <>
<motion.ul className="orders-list" variants={containerVariants} initial="hidden" animate="visible">
    <AnimatePresence>
        {currentOrders.map(order => (
            <motion.li key={order._id} className="order-item" variants={itemVariants} exit={{ opacity: 0, x: -50 }}>
                <div className="order-summary">
                    <div className="order-detail-group">
                        <p>{order._id}</p>
                    </div>
                    <div className="order-detail-group">
                        <p>{order.customerName}</p>
                    </div>
                    <div className="order-detail-group">
                        <p>${order.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div className="order-detail-group">
                        <PaymentBadge status={order.paymentStatus} />
                    </div>
                    <div className="order-detail-group">
                        <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="status-dropdown"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value="pending">Pending</option>
                            <option value="ready">Ready</option>
                            <option value="in progress">In Progress</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    
                    <div className="order-actions">
                        {order.status === "rejected" && (
                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Are you sure you want to delete this order?")) {
                                        deleteOrder(order._id);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        )}
                        <button
                          className="toggle-details-button"
                          onClick={() => toggleOrderDetails(order._id)}
                          aria-expanded={expandedOrderId === order._id}
                        >
                            {expandedOrderId === order._id ? (
                                <ChevronUp size={20} className="text-gray-500" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>
                <AnimatePresence>
                    {expandedOrderId === order._id && (
                        <motion.div
                            className="order-details-container"
                            variants={detailsVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <h4>Ordered Items</h4>
                            <ul className="items-list">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                        <li key={item.coffee_id} className="item-row">
                                            <span className="item-name">{item.coffee_name}</span>
                                            <span className="item-quantity">x{item.quantity}</span>
                                            <span className="item-price">
                                                ${item.price_at_time_of_order?.toFixed(2) || '0.00'}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm italic text-gray-500">
                                        No items found for this order.
                                    </li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.li>
        ))}
    </AnimatePresence>
</motion.ul>
<div className="pagination-container">
    <button
        className="pagination-button"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
    >
        Previous
    </button>
    {Array.from({ length: totalPages }, (_, i) => (
        <button
            key={i + 1}
            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => paginate(i + 1)}
        >
            {i + 1}
        </button>
    ))}
    <button
        className="pagination-button"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
    >
        Next
    </button>
</div>
                        </>
                    ) : (
                        <div className="no-results">
                            <p>No orders found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
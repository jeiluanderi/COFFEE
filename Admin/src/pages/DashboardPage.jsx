import React, { useState, useEffect } from 'react';
import { Plus, ArrowUp, CheckCircle, Search } from 'lucide-react';
import axios from 'axios';
// NewOrderModal will be required if the 'CREATE NEW ORDER' button is to be functional.
// import NewOrderModal from '../components/NewOrderModal'; 


// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};


// Component to display dynamic header message and current date
const Header = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [typedMessage, setTypedMessage] = useState('');
    const fullMessage = "Welcome, Admin! Here's your dashboard overview.";

    useEffect(() => {
        let charIndex = 0;
        setTypedMessage('');

        const typingInterval = setInterval(() => {
            if (charIndex <= fullMessage.length) {
                setTypedMessage(fullMessage.substring(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, [fullMessage]);

    useEffect(() => {
        const formatDate = () => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);
            setCurrentDate(formattedDate);
        };
        formatDate();
    }, []);

    return (
        <header className="main-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#36220B' }}>{typedMessage}</h2>
            <span className="date" style={{ fontSize: '1rem', color: '#6F4E37' }}>{currentDate}</span>
        </header>
    );
};


// Summary Cards Component - adapted for Admin View
const SummaryCards = ({ onNewOrderClick }) => {
    const [summaryData, setSummaryData] = useState({
        newOrders: 0,
        totalOrders: 0,
        waitingList: 0, // This might represent pending inquiries or orders
        totalOrdersChange: 0,
        waitingListChange: 0,
    });
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                // Ensure the /api/summary endpoint exists and returns this data,
                // or create it on the backend. This endpoint would also be protected.
                const response = await axios.get(`${backendUrl}/api/summary`, { headers: getAuthHeaders() });
                setSummaryData(response.data);
            } catch (error) {
                console.error("Error fetching summary data:", error);
                // Fallback to dummy data on error
                setSummaryData({
                    newOrders: 16,
                    totalOrders: 86,
                    waitingList: 5,
                    totalOrdersChange: 2.5,
                    waitingListChange: 1.2,
                });
            }
        };
        fetchSummaryData();
    }, [backendUrl]);

    return (
        <div className="summary-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '24px'
        }}>
            <div className="card summary-card" style={{ textAlign: 'left' }}>
                <div className="summary-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="summary-card-title" style={{ fontSize: '1.1rem', fontWeight: '500', color: '#6F4E37' }}>New Orders</span>
                    <div className="icon-circle yellow" style={{ backgroundColor: '#F7B731', borderRadius: '50%', padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CheckCircle size={20} color="white" /></div>
                </div>
                <div className="value" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#36220B' }}>{summaryData.newOrders}</div>
                <span className="subtitle" style={{ fontSize: '0.9rem', color: '#8B4513' }}>Updated every new order</span>
            </div>
            <div className="card summary-card" style={{ textAlign: 'left' }}>
                <div className="summary-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="summary-card-title" style={{ fontSize: '1.1rem', fontWeight: '500', color: '#6F4E37' }}>Total Orders</span>
                    <div className="icon-circle yellow" style={{ backgroundColor: '#8B4513', borderRadius: '50%', padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ArrowUp size={20} color="white" /></div>
                </div>
                <div className="value" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#36220B' }}>{summaryData.totalOrders}</div>
                <span className="subtitle" style={{ fontSize: '0.9rem', color: '#6F4E37', display: 'flex', alignItems: 'center' }}>
                    <ArrowUp size={16} color="#4a5568" style={{ marginRight: '4px' }} />+{summaryData.totalOrdersChange}% than usual
                </span>
            </div>
            <div className="card summary-card" style={{ textAlign: 'left' }}>
                <div className="summary-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="summary-card-title" style={{ fontSize: '1.1rem', fontWeight: '500', color: '#6F4E37' }}>Waiting List</span>
                    <div className="icon-circle yellow" style={{ backgroundColor: '#6F4E37', borderRadius: '50%', padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ArrowUp size={20} color="white" /></div>
                </div>
                <div className="value" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#36220B' }}>{summaryData.waitingList}</div>
                <span className="subtitle" style={{ fontSize: '0.9rem', color: '#6F4E37', display: 'flex', alignItems: 'center' }}>
                    <ArrowUp size={16} color="#4a5568" style={{ marginRight: '4px' }} />+{summaryData.waitingListChange}% than usual
                </span>
            </div>
            {/* Create New Order Button for Admin */}
            <button
                className="create-order-btn card"
                onClick={onNewOrderClick}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F8F5EB',
                    border: '2px dashed #8B4513',
                    color: '#8B4513',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none',
                }}
            >
                <Plus size={30} className="mb-2" />
                CREATE NEW ORDER
            </button>
        </div>
    );
};


// OrderList Component - Admin View
const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                // Admin can fetch all orders
                const response = await axios.get(`${backendUrl}/api/orders`, { headers: getAuthHeaders() });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([
                    { id: 'ORD001', customerName: 'John Doe', items: 3, status: 'In Progress', orderDate: '2025-08-20' },
                    { id: 'ORD002', customerName: 'Jane Smith', items: 1, status: 'Ready', orderDate: '2025-08-21' },
                    { id: 'ORD003', customerName: 'Coffee Lover', items: 5, status: 'Completed', orderDate: '2025-08-22' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [backendUrl]);

    const filteredOrders = orders.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="card">Loading orders...</div>;

    return (
        <div className="card order-list-card">
            <div className="list-header">
                <h3>Latest Orders</h3>
                <div className="search-input-group" style={{ display: 'flex', alignItems: 'center' }}>
                    <Search size={20} style={{ marginRight: '8px', color: '#6F4E37' }} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            width: '180px'
                        }}
                    />
                </div>
            </div>
            <ul className="item-list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <li key={order.id} className="list-item">
                            <div className="item-info">
                                <div className="item-id-badge">{order.id}</div>
                                <div className="item-details">
                                    <h4>{order.customerName}</h4>
                                    <span>{order.items} items</span>
                                </div>
                            </div>
                            <span className={`status-badge ${order.status?.toLowerCase().replace(' ', '-')}`}>
                                {order.status}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="list-item no-results" style={{ color: '#6F4E37' }}>No orders found.</li>
                )}
            </ul>
        </div>
    );
};


// SideCards Component - Admin View
const SideCards = () => {
    const [popularDishes, setPopularDishes] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular dishes - using public endpoint for now, but admin will eventually have better management
                const popularResponse = await axios.get(`${backendUrl}/api/coffees`, { headers: getAuthHeaders() }); // Auth header might not be needed if endpoint is public
                const allCoffees = popularResponse.data;

                // Simple logic to determine "popular" (e.g., top 3 by price)
                const sortedCoffees = [...allCoffees].sort((a, b) => b.price - a.price);
                setPopularDishes(sortedCoffees.slice(0, 3).map((c, index) => ({
                    id: c.id,
                    name: c.name,
                    orders: Math.floor(Math.random() * 50) + 10, // Simulate order count
                    image: c.image_url || `https://placehold.co/40x40/F8F5EB/6F4E37?text=${index + 1}`
                })));

                // Filter out-of-stock items (stock_quantity <= 5)
                const outOfStockItems = allCoffees.filter(coffee => coffee.stock_quantity <= 5);
                setOutOfStock(outOfStockItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    available: item.stock_quantity
                })));

            } catch (error) {
                console.error("Error fetching side card data:", error);
                setPopularDishes([
                    { name: 'Espresso', orders: 120, image: 'https://placehold.co/40x40/F8F5EB/6F4E37?text=E' },
                    { name: 'Latte', orders: 90, image: 'https://placehold.co/40x40/F8F5EB/6F4E37?text=L' },
                    { name: 'Cappuccino', orders: 85, image: 'https://placehold.co/40x40/F8F5EB/6F4E37?text=C' },
                ]);
                setOutOfStock([
                    { name: 'Guatemala Coffee', available: 2 },
                    { name: 'Ethiopian Beans', available: 0 },
                ]);
            }
        };

        fetchData();
    }, [backendUrl]);

    return (
        <div>
            <div className="card">
                <div className="list-header">
                    <h3>Popular Coffees</h3>
                    <a href="#" style={{ color: '#8B4513' }}>View All</a>
                </div>
                <ul className="item-list">
                    {popularDishes.map((dish, index) => (
                        <li key={dish.id || index} className="dish-item">
                            <div className="item-info">
                                <span className="item-id-badge" style={{ backgroundColor: '#E8D2BB', color: '#36220B' }}>{index + 1}</span>
                                <img src={dish.image} alt={dish.name} className="user-avatar" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', marginRight: '12px' }} />
                                <div className="item-details">
                                    <h4>{dish.name}</h4>
                                    <span>Orders: {dish.orders}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
                <div className="list-header">
                    <h3>Low Stock / Out of Stock</h3>
                    <a href="#" style={{ color: '#8B4513' }}>View All</a>
                </div>
                <ul className="item-list">
                    {outOfStock.length > 0 ? (
                        outOfStock.map((item, index) => (
                            <li key={item.id || index} className="out-of-stock-item" style={{ color: item.available === 0 ? '#dc3545' : '#ffc107' }}>
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <span>Available: {item.available}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-item no-results" style={{ color: '#6F4E37' }}>All items are well-stocked!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};


// Main Dashboard Page Component
const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ordersUpdateTrigger, setOrdersUpdateTrigger] = useState(0);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleOrderCreated = () => {
        setOrdersUpdateTrigger(prev => prev + 1);
        closeModal();
    };

    // Placeholder for AnalyticsLineChartCard
    const AnalyticsLineChartCard = () => {
        const [timeframe, setTimeframe] = useState('weekly');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

        useEffect(() => {
            const fetchChartData = async () => {
                try {
                    // This endpoint needs to be implemented in server.js and protected
                    const response = await axios.get(`${backendUrl}/api/analytics/sales?timeframe=${timeframe}`, { headers: getAuthHeaders() });
                    console.log("Sales Report Data:", response.data);
                } catch (error) {
                    console.error("Error fetching line chart data:", error);
                }
            };
            fetchChartData();
        }, [timeframe, backendUrl]);

        return (
            <div className="card">
                <div className="analytics-header">
                    <h3>Sales Report</h3>
                    <div className="timeframe-selector" style={{ display: 'flex', gap: '8px' }}>
                        <button className={`status-badge ${timeframe === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframe('weekly')} style={{ cursor: 'pointer' }}>Weekly</button>
                        <button className={`status-badge ${timeframe === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframe('monthly')} style={{ cursor: 'pointer' }}>Monthly</button>
                        <button className={`status-badge ${timeframe === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframe('yearly')} style={{ cursor: 'pointer' }}>Yearly</button>
                    </div>
                </div>
                <p style={{ color: '#718096' }}>Line chart data here...</p>
                <img src="https://placehold.co/400x200/F0F4F8/6F4E37?text=Sales+Chart" alt="Sales Chart" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
        );
    };

    // Placeholder for AnalyticsBarCharts
    const AnalyticsBarCharts = () => {
        const [timeframe, setTimeframe] = useState('weekly');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

        useEffect(() => {
            const fetchChartData = async () => {
                try {
                    // This endpoint needs to be implemented in server.js and protected
                    const response = await axios.get(`${backendUrl}/api/analytics/bar-data?timeframe=${timeframe}`, { headers: getAuthHeaders() });
                    console.log("Bar Chart Data:", response.data);
                } catch (error) {
                    console.error("Error fetching bar chart data:", error);
                }
            };
            fetchChartData();
        }, [timeframe, backendUrl]);

        return (
            <div className="card">
                <div className="analytics-header">
                    <h3>Order Analytics</h3>
                    <div className="timeframe-selector" style={{ display: 'flex', gap: '8px' }}>
                        <button className={`status-badge ${timeframe === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframe('weekly')} style={{ cursor: 'pointer' }}>Weekly</button>
                        <button className={`status-badge ${timeframe === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframe('monthly')} style={{ cursor: 'pointer' }}>Monthly</button>
                        <button className={`status-badge ${timeframe === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframe('yearly')} style={{ cursor: 'pointer' }}>Yearly</button>
                    </div>
                </div>
                <p style={{ color: '#718096' }}>Bar chart data here...</p>
                <img src="https://placehold.co/400x200/F0F4F8/8B4513?text=Order+Chart" alt="Order Chart" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
        );
    };


    return (
        <main className="main-content">
            <Header />
            <SummaryCards onNewOrderClick={openModal} />
            <div className="analytics-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '24px'
            }}>
                <AnalyticsLineChartCard />
                <AnalyticsBarCharts />
            </div>
            <div className="order-payment-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 0.5fr', // Adjust ratio as needed
                gap: '24px',
                '@media (max-width: 768px)': { // Basic responsive adjustment
                    gridTemplateColumns: '1fr',
                }
            }}>
                <OrderList
                    updateTrigger={ordersUpdateTrigger}
                />
                <SideCards />
            </div>
            {/* NewOrderModal needs to be defined if you want to use it */}
            {/*
            <NewOrderModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onOrderCreated={handleOrderCreated}
            />
            */}
        </main>
    );
};

export default DashboardPage;

import React, { useState, useEffect, Component } from 'react';
import { Plus, ArrowUp, CheckCircle, Search } from 'lucide-react';
import axios from 'axios';
import '../../src/DashboardPage.css';
// import CreateOrderModal from '../components/CreateOrderModal'; // Remove this import

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
        <header className="main-header">
            <h2 className="header-title">{typedMessage}</h2>
            <span className="header-date">{currentDate}</span>
        </header>
    );
};

// Summary Cards Component - adapted for Admin View
// The `onNewOrderClick` prop is no longer needed
const SummaryCards = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = 'http://localhost:3001';
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchSummaryData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setSummaryData(null);
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${backendUrl}/api/analytics/summary`, { headers: getAuthHeaders() });
                setSummaryData(response.data);
            } catch (error) {
                console.error("Error fetching summary data:", error.response?.data || error.message);
                setSummaryData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummaryData();
    }, []);

    if (isLoading) {
        return <div className="summary-grid"><div className="card loading-card">Loading summary...</div></div>;
    }

    if (!summaryData) {
        return <div className="summary-grid"><div className="card error-card">Failed to load summary data.</div></div>;
    }

    const { total_sales, total_orders, total_users, total_coffees } = summaryData;

    return (
        <div className="summary-grid">
            <div className="card summary-card">
                <div className="summary-card-header">
                    <span className="summary-card-title">Total Sales</span>
                    <div className="icon-circle yellow"><CheckCircle size={20} color="white" /></div>
                </div>
                <div className="summary-value">${total_sales ? total_sales.toFixed(2) : '0.00'}</div>
                <span className="summary-subtitle">Total revenue from completed orders</span>
            </div>
            <div className="card summary-card">
                <div className="summary-card-header">
                    <span className="summary-card-title">Total Orders</span>
                    <div className="icon-circle brown"><ArrowUp size={20} color="white" /></div>
                </div>
                <div className="summary-value">{total_orders || 0}</div>
                <span className="summary-subtitle subtitle-with-icon">
                    <ArrowUp size={16} color="#4a5568" />
                    {total_orders || 0} all-time orders
                </span>
            </div>
            <div className="card summary-card">
                <div className="summary-card-header">
                    <span className="summary-card-title">Total Users</span>
                    <div className="icon-circle brown-darker"><ArrowUp size={20} color="white" /></div>
                </div>
                <div className="summary-value">{total_users || 0}</div>
                <span className="summary-subtitle subtitle-with-icon">
                    <ArrowUp size={16} color="#4a5568" />
                    {total_users || 0} registered users
                </span>
            </div>
            {/* The button for creating a new order is now removed */}
        </div>
    );
};

// OrderList Component - The `onNewOrderClick` prop is no longer needed
const OrderList = ({ orders, isLoading, searchTerm, setSearchTerm }) => {
    const filteredOrders = orders.filter(order =>
        (order.id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="card order-list-card"><div className="list-header"><h3>Latest Orders</h3></div><div className="loading-state"><div className="spinner"></div><p>Loading orders...</p></div></div>;

    return (
        <div className="card order-list-card">
            <div className="list-header">
                <h3>Latest Orders</h3>
                <div className="search-input-group">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                {/* The "Add Order" button is removed */}
            </div>
            <ul className="item-list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <li key={order.id} className="list-item">
                            <div className="item-info">
                                <div className="item-id-badge">{order.id}</div>
                                <div className="item-details">
                                    <h4>{order.customerName}</h4>
                                    <span>{order.items?.length || 0} items</span>
                                </div>
                            </div>
                            <span className={`status-badge ${order.status?.toLowerCase().replace(' ', '-')}`}>
                                {order.status}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="list-item no-results">No orders found.</li>
                )}
            </ul>
        </div>
    );
};

// SideCards Component - Admin View
const SideCards = () => {
    const [popularCoffees, setPopularCoffees] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = 'http://localhost:3001';
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setPopularCoffees([]);
                setOutOfStock([]);
                setIsLoading(false);
                return;
            }
            try {
                const popularResponse = await axios.get(`${backendUrl}/api/analytics/bar-data`, { headers: getAuthHeaders() });
                const popularData = popularResponse.data.map(item => ({
                    id: item.coffee_id,
                    name: item.product_name,
                    orders: parseInt(item.total_quantity_sold, 10),
                    image: `https://placehold.co/40x40/F8F5EB/6F4E37?text=${item.product_name.charAt(0).toUpperCase()}`
                }));
                setPopularCoffees(popularData);

                const allCoffeesResponse = await axios.get(`${backendUrl}/api/coffees`, { headers: getAuthHeaders() });
                const allCoffees = allCoffeesResponse.data;
                const outOfStockItems = allCoffees.filter(coffee => coffee.stock_quantity <= 5);
                setOutOfStock(outOfStockItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    available: item.stock_quantity
                })));
            } catch (error) {
                console.error("Error fetching side card data:", error.response?.data || error.message);
                setPopularCoffees([]);
                setOutOfStock([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="side-cards">
                <div className="card loading-card"><div className="spinner"></div><p>Loading...</p></div>
                <div className="card low-stock-card loading-card"><div className="spinner"></div><p>Loading...</p></div>
            </div>
        );
    }

    return (
        <div className="side-cards">
            <div className="card">
                <div className="list-header">
                    <h3>Popular Coffees</h3>
                    <a href="#" className="view-all-link">View All</a>
                </div>
                <ul className="item-list">
                    {popularCoffees.length > 0 ? (
                        popularCoffees.map((dish, index) => (
                            <li key={dish.id || index} className="dish-item">
                                <div className="item-info">
                                    <span className="item-id-badge">{index + 1}</span>
                                    <img src={dish.image} alt={dish.name} className="user-avatar" />
                                    <div className="item-details">
                                        <h4>{dish.name}</h4>
                                        <span>Orders: {dish.orders}</span>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-item no-results">No popular coffees found.</li>
                    )}
                </ul>
            </div>

            <div className="card low-stock-card">
                <div className="list-header">
                    <h3>Low Stock / Out of Stock</h3>
                    <a href="#" className="view-all-link">View All</a>
                </div>
                <ul className="item-list">
                    {outOfStock.length > 0 ? (
                        outOfStock.map((item, index) => (
                            <li key={item.id || index} className={`out-of-stock-item ${item.available === 0 ? 'out-of-stock' : 'low-stock'}`}>
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <span>Available: {item.available}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-item no-results">All items are well-stocked!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

// Placeholder for AnalyticsLineChartCard
const AnalyticsLineChartCard = () => {
    const [timeframe, setTimeframe] = useState('weekly');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = 'http://localhost:3001';
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchChartData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setChartData([]);
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${backendUrl}/api/analytics/sales?timeframe=${timeframe}`, { headers: getAuthHeaders() });
                setChartData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching line chart data:", error.response?.data || error.message);
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChartData();
    }, [timeframe]);

    return (
        <div className="card analytics-chart-card">
            <div className="analytics-header">
                <h3>Sales Report</h3>
                <div className="timeframe-selector">
                    <button className={`status-badge ${timeframe === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframe('weekly')}>Weekly</button>
                    <button className={`status-badge ${timeframe === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframe('monthly')}>Monthly</button>
                    <button className={`status-badge ${timeframe === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframe('yearly')}>Yearly</button>
                </div>
            </div>
            {isLoading ? (
                <div className="loading-state"><div className="spinner"></div><p>Loading chart data...</p></div>
            ) : chartData.length > 0 ? (
                <p className="chart-placeholder">Chart component for sales data here...</p>
            ) : (
                <p className="chart-placeholder">No data available for {timeframe} timeframe.</p>
            )}
        </div>
    );
};

// Placeholder for AnalyticsBarCharts
const AnalyticsBarCharts = () => {
    const [timeframe, setTimeframe] = useState('weekly');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = 'http://localhost:3001';
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchChartData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setChartData([]);
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${backendUrl}/api/analytics/bar-data`, { headers: getAuthHeaders() });
                setChartData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching bar chart data:", error.response?.data || error.message);
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChartData();
    }, [timeframe]);

    return (
        <div className="card analytics-chart-card">
            <div className="analytics-header">
                <h3>Order Analytics</h3>
                <div className="timeframe-selector">
                    <button className={`status-badge ${timeframe === 'weekly' ? 'active' : ''}`} onClick={() => setTimeframe('weekly')}>Weekly</button>
                    <button className={`status-badge ${timeframe === 'monthly' ? 'active' : ''}`} onClick={() => setTimeframe('monthly')}>Monthly</button>
                    <button className={`status-badge ${timeframe === 'yearly' ? 'active' : ''}`} onClick={() => setTimeframe('yearly')}>Yearly</button>
                </div>
            </div>
            {isLoading ? (
                <div className="loading-state"><div className="spinner"></div><p>Loading chart data...</p></div>
            ) : chartData.length > 0 ? (
                <p className="chart-placeholder">Chart component for order data here...</p>
            ) : (
                <p className="chart-placeholder">No data available.</p>
            )}
        </div>
    );
};

// Error Boundary Component - Catches errors in its child components
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught in ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2 className="text-red-500">Something went wrong. Please refresh the page.</h2>;
        }
        return this.props.children;
    }
}

// Main Dashboard Page Component
const DashboardPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const backendUrl = 'http://localhost:3001';
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setOrders([]);
            setIsLoadingOrders(false);
            return;
        }
        try {
            const response = await axios.get(`${backendUrl}/api/orders`, { headers: getAuthHeaders() });
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data || error.message);
            setOrders([]);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <ErrorBoundary>
            <div className="dashboard-page">
                <Header />
                <SummaryCards />
                <div className="analytics-grid">
                    <AnalyticsLineChartCard />
                    <AnalyticsBarCharts />
                </div>
                <div className="order-payment-grid">
                    <OrderList
                        orders={orders}
                        isLoading={isLoadingOrders}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <SideCards />
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default DashboardPage;
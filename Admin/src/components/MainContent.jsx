import React, { useState } from 'react';
import { Plus, ArrowUp, CheckCircle, Search } from 'lucide-react';
import '../index.css';

// const Header = () => {
//     return (
//         <header className="main-header">
//             <h2>Nice! We have a lot of orders 🙂</h2>
//             <span className="date">Wednesday, 12 July 2023</span>
//         </header>
//     );
// };

// const SummaryCards = () => {
//     return (
//         <div className="summary-grid">
//             <div className="summary-card">
//                 <div className="summary-card-header">
//                     <span className="summary-card-title">New Orders</span>
//                     <div className="icon-circle yellow"><CheckCircle size={20} color="white" /></div>
//                 </div>
//                 <div className="value">16</div>
//                 <span className="subtitle">Updated every new order</span>
//             </div>
//             <div className="summary-card">
//                 <div className="summary-card-header">
//                     <span className="summary-card-title">Total Orders</span>
//                     <div className="icon-circle yellow"><ArrowUp size={20} color="white" /></div>
//                 </div>
//                 <div className="value">86</div>
//                 <span className="subtitle"><ArrowUp size={16} color="#4a5568" className="icon" />+2.5% than usual</span>
//             </div>
//             <div className="summary-card">
//                 <div className="summary-card-header">
//                     <span className="summary-card-title">Waiting List</span>
//                     <div className="icon-circle yellow"><ArrowUp size={20} color="white" /></div>
//                 </div>
//                 <div className="value">9</div>
//                 <span className="subtitle"><ArrowUp size={16} color="#4a5568" className="icon" />+3.2% than usual</span>
//             </div>
//             <button className="create-order-btn">
//                 <Plus size={24} className="mr-2" />
//                 CREATE NEW ORDER
//             </button>
//         </div>
//     );
// };

// const OrderList = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const orderList = [
//         { id: 'A4', name: 'Ariel Hikmat', items: 5, status: 'Ready' },
//         { id: 'B2', name: 'Denis Freeman', items: 4, status: 'In Progress' },
//         { id: 'TA', name: 'Morgan Cox', items: 6, status: 'In Progress' },
//         { id: 'A8', name: 'Paul Rey', items: 6, status: 'In Progress' },
//         { id: 'A9', name: 'Maja Becker', items: 8, status: 'Completed' },
//         { id: 'C2', name: 'Erwan Richard', items: 6, status: 'Completed' },
//     ];

//     const filteredOrders = orderList.filter(order =>
//         order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.id.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="card">
//             <div className="list-header">
//                 <h3>Order List</h3>
//                 <div className="search-container">
//                     <Search size={20} className="icon" />
//                     <input
//                         type="text"
//                         placeholder="Search a Order"
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//             </div>
//             <ul className="item-list">
//                 {filteredOrders.map(order => (
//                     <li key={order.id} className="list-item">
//                         <div className="item-info">
//                             <div className="item-id-badge">{order.id}</div>
//                             <div className="item-details">
//                                 <h4>{order.name}</h4>
//                                 <span>{order.items} items</span>
//                             </div>
//                         </div>
//                         <span
//                             className={`status-badge ${order.status
//                                 .toLowerCase()
//                                 .replace(' ', '-')}`}
//                         >
//                             {order.status}
//                         </span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// const PaymentList = () => {
//     const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
//     const paymentList = [
//         { id: 'A9', name: 'Maja Becker', order: '#912', status: 'Pay Now' },
//         { id: 'A2', name: 'Stefan Meijer', order: '#904', status: 'Pay Now' },
//         { id: 'A3', name: 'Julie Madsen', order: '#903', status: 'Pay Now' },
//         { id: 'A4', name: 'Aulia Julie', order: '#897', status: 'Pay Now' },
//         { id: 'B4', name: 'Emma Fortin', order: '#892', status: 'Pay Now' },
//     ];

//     const filteredPayments = paymentList.filter(payment =>
//         payment.name.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
//         payment.order.toLowerCase().includes(paymentSearchTerm.toLowerCase())
//     );

//     return (
//         <div className="card">
//             <div className="list-header">
//                 <h3>Payment</h3>
//                 <div className="search-container">
//                     <Search size={20} className="icon" />
//                     <input
//                         type="text"
//                         placeholder="Search a Order"
//                         value={paymentSearchTerm}
//                         onChange={e => setPaymentSearchTerm(e.target.value)}
//                     />
//                 </div>
//             </div>
//             <ul className="item-list">
//                 {filteredPayments.map(payment => (
//                     <li key={payment.id} className="list-item">
//                         <div className="item-info">
//                             <div className="item-id-badge">{payment.id}</div>
//                             <div className="item-details">
//                                 <h4>{payment.name}</h4>
//                                 <span>Order {payment.order}</span>
//                             </div>
//                         </div>
//                         <span
//                             className={`status-badge ${payment.status
//                                 .toLowerCase()
//                                 .replace(' ', '-')}`}
//                         >
//                             {payment.status}
//                         </span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// const SideCards = () => {
//     const popularDishes = [
//         { rank: 1, name: 'Scrambled Eggs With Toast', orders: 23, image: 'https://placehold.co/40x40/f0f4f8/94a3b8?text=1' },
//         { rank: 2, name: 'Tacos With Chicken Grilled', orders: 16, image: 'https://placehold.co/40x40/f0f4f8/94a3b8?text=2' },
//         { rank: 3, name: 'Spaghetti Bolognese', orders: 13, image: 'https://placehold.co/40x40/f0f4f8/94a3b8?text=3' },
//         { rank: 4, name: 'French Bread & Potato', orders: 12, image: 'https://placehold.co/40x40/f0f4f8/94a3b8?text=4' },
//     ];

//     const outOfStock = [
//         { name: 'Hawaiian Chicken Skewers', available: '04:00 PM' },
//         { name: 'Veggie Supreme Pizza', available: '03:30 PM' },
//         { name: 'Fish and Chips', available: '04:20 PM' },
//         { name: 'Spaghetti Bolognese', available: 'Tomorrow' },
//     ];

//     return (
//         <div>
//             <div className="card">
//                 <div className="list-header">
//                     <h3>Popular Dishes</h3>
//                     <a href="#">View All</a>
//                 </div>
//                 <ul className="item-list">
//                     {popularDishes.map(dish => (
//                         <li key={dish.rank} className="dish-item">
//                             <span className="rank">{dish.rank}</span>
//                             <img src={dish.image} alt={dish.name} />
//                             <div className="item-details">
//                                 <h4>{dish.name}</h4>
//                                 <span>Orders: {dish.orders}</span>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="card" style={{ marginTop: '24px' }}>
//                 <div className="list-header">
//                     <h3>Out of Stock</h3>
//                     <a href="#">View All</a>
//                 </div>
//                 <ul className="item-list">
//                     {outOfStock.map((item, index) => (
//                         <li key={index} className="out-of-stock-item">
//                             <h4>{item.name}</h4>
//                             <span>Available: {item.available}</span>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

const MainContent = () => {
    return (
        <main className="main-content">
            <Header />
            <SummaryCards />
            <div className="order-payment-grid">
                <OrderList />
                <PaymentList />
                <SideCards />
            </div>
        </main>
    );
};

export default MainContent;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search } from 'lucide-react';
// import '../index.css';

// const PaymentList = () => {
//     // State to hold the fetched payments
//     const [payments, setPayments] = useState([]);
//     const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         // Function to fetch data from your backend API
//         const fetchPayments = async () => {
//             try {
//                 setIsLoading(true);
//                 // Replace with your actual backend API endpoint
//                 const response = await axios.get('https://localhost:3001/api/payments');
//                 setPayments(response.data);
//             } catch (error) {
//                 console.error("Error fetching payments:", error);
//                 // In a real app, you might want to show an error message to the user here.
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchPayments();
//     }, []); // The empty array ensures this runs only once

//     const filteredPayments = payments.filter(payment =>
//         payment.name.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
//         payment.order.toLowerCase().includes(paymentSearchTerm.toLowerCase())
//     );

//     if (isLoading) {
//         return <div className="card loading-state">Loading payments...</div>;
//     }

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
//                 {filteredPayments.length > 0 ? (
//                     filteredPayments.map(payment => (
//                         <li key={payment.id} className="list-item">
//                             <div className="item-info">
//                                 <div className="item-id-badge">{payment.id}</div>
//                                 <div className="item-details">
//                                     <h4>{payment.name}</h4>
//                                     <span>Order {payment.order}</span>
//                                 </div>
//                             </div>
//                             <span
//                                 className={`status-badge ${payment.status
//                                     .toLowerCase()
//                                     .replace(' ', '-')}`}
//                             >
//                                 {payment.status}
//                             </span>
//                         </li>
//                     ))
//                 ) : (
//                     <li className="list-item no-results">No payments found.</li>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default PaymentList;

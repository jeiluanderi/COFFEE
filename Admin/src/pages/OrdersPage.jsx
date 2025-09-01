import React from 'react';
import OrderList from '../components/OrderList';
import '../index.css';

const OrdersPage = () => {
    return (
        <main className="main-content">
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c' }}>Orders Page</h2>
            <p style={{ color: '#718096' }}>Here are the latest orders.</p>
            <div className="orders-container" style={{ marginTop: '20px' }}>
                <OrderList />
            </div>
        </main>
    );
};

export default OrdersPage;
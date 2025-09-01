import React from 'react';
import './index.css';; // Adjust path as necessary for your admin folder structure

const AdminUsersPage = () => {
    return (
        <main className="main-content">
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>Manage Users</h2>
            <p style={{ color: '#718096' }}>This page will allow administrators to view and manage user accounts (e.g., update roles).</p>
            <div className="card" style={{ marginTop: '20px', padding: '20px' }}>
                <p>CRUD functionality for users coming soon...</p>
            </div>
        </main>
    );
};

export default AdminUsersPage;

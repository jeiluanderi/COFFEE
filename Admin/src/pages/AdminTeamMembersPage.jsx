import React from 'react';
import './index.css'; // Adjust path as necessary for your admin folder structure

const AdminTeamMembersPage = () => {
    return (
        <main className="main-content">
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>Manage Team Members</h2>
            <p style={{ color: '#718096' }}>This page will allow administrators to create, view, update, and delete barista/team member profiles.</p>
            <div className="card" style={{ marginTop: '20px', padding: '20px' }}>
                <p>CRUD functionality for team members coming soon...</p>
            </div>
        </main>
    );
};

export default AdminTeamMembersPage;

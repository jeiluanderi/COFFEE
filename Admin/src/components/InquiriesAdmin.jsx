import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaSpinner, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import './InquiriesAdmin.css';

const InquiriesAdmin = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10); 
    const [search, setSearch] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem('token'); 

    const fetchInquiries = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:3001/api/admin/inquiries?page=${page}&limit=${limit}&search=${search}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInquiries(res.data.inquiries);
            setTotalCount(res.data.totalCount);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Failed to fetch inquiries:', err);
            setError('Failed to load inquiries. Please check your network and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, [page, search]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:3001/api/admin/inquiries/${id}`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setInquiries(inquiries.map(inq => 
                inq.id === id ? { ...inq, status: newStatus } : inq
            ));
        } catch (err) {
            console.error('Failed to update status:', err);
            setError('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        
        try {
            await axios.delete(`http://localhost:3001/api/admin/inquiries/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInquiries(inquiries.filter(inq => inq.id !== id));
            setTotalCount(prevCount => prev-Count - 1);
        } catch (err) {
            console.error('Failed to delete inquiry:', err);
            setError('Failed to delete inquiry.');
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 for a new search
    };

    return (
        <div className="inquiries-page-container">
            <div className="inquiries-page-content">
                <div className="inquiries-card">
                    <div className="page-header">
                        <h1 className="page-title">Customer Inquiries</h1>
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name, email, or subject"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state"><FaSpinner className="spinner" /> Loading...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : inquiries.length > 0 ? (
                        <>
                            <div className="table-container">
                                <table className="inquiries-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Subject</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inquiries.map((inq) => (
                                            <tr key={inq.id}>
                                                <td>{inq.id}</td>
                                                <td>{inq.name}</td>
                                                <td>{inq.email}</td>
                                                <td><span className={`status-badge status-${inq.subject}`}>{inq.subject}</span></td>
                                                <td>{inq.message.substring(0, 50)}...</td>
                                                <td>
                                                    <select
                                                        className="status-dropdown"
                                                        value={inq.status}
                                                        onChange={(e) => handleStatusUpdate(inq.id, e.target.value)}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="resolved">Resolved</option>
                                                    </select>
                                                </td>
                                                <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="icon-btn delete-btn" onClick={() => handleDelete(inq.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination-container">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                >
                                    <FaChevronLeft /> Prev
                                </button>
                                <span className="page-info">Page {page} of {totalPages}</span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                >
                                    Next <FaChevronRight />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-results no-inquiries-message">No inquiries found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InquiriesAdmin;
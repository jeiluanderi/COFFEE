import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';
import UserModal from '../components/UserModal'; // Import the new modal component

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
        const response = await axios.get(
            `${backendUrl}/api/admin/users?page=${currentPage}&limit=${usersPerPage}`,
            getAuthHeaders()
        );
        // Ensure response.data and its properties exist before setting state
        if (response.data && response.data.users && response.data.totalCount) {
            setUsers(response.data.users);
            setTotalUsers(response.data.totalCount);
        } else {
            // Handle unexpected response structure
            throw new Error('Invalid data structure received from API.');
        }
    } catch (err) {
        console.error('Error fetching users:', err.response?.data || err);
        setError(err.response?.data?.message || 'Failed to load users. Please check the backend connection or API structure.');
        setUsers([]); // Crucially, set users to an empty array on error
        setTotalUsers(0);
    } finally {
        setIsLoading(false);
    }
}, [backendUrl, currentPage, usersPerPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAddUser = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${backendUrl}/api/admin/users/${userId}`, getAuthHeaders());
                fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err.response?.data || err);
                setError(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };
    
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const pageStyles = `
        .main-content {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            background-color: #f9fafb;
        }
        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .list-header h2 {
            font-size: 2rem;
            font-weight: 700;
        }
        .submit-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: #6F4E37;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 600;
            transition: background-color 0.3s ease;
            border: none;
        }
        .submit-btn:hover {
            background-color: #4F3827;
        }
        .card {
            background-color: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .table-container {
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 1rem;
        }
        thead th {
            text-align: left;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            color: #4B5563;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        tbody tr {
            background-color: #f9fafb;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
        }
        tbody tr:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        td {
            padding: 1rem;
            vertical-align: middle;
        }
        td:first-child {
            border-top-left-radius: 0.75rem;
            border-bottom-left-radius: 0.75rem;
        }
        td:last-child {
            border-top-right-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
        }
        .icon-btn {
            padding: 0.5rem;
            border-radius: 50%;
            background: none;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease;
            margin: 0 0.25rem;
        }
        .edit-btn {
            color: #2563EB;
        }
        .delete-btn {
            color: #DC2626;
        }
        .edit-btn:hover {
            background-color: #DBEAFE;
        }
        .delete-btn:hover {
            background-color: #FEE2E2;
        }
        .pagination-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 2rem;
            gap: 0.5rem;
        }
        .pagination-btn {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .pagination-btn:hover:not(.active) {
            background-color: #f0f0f0;
        }
        .pagination-btn.active {
            background-color: #6F4E37;
            color: white;
            border-color: #6F4E37;
        }
        .pagination-btn:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    `;

    if (isLoading) {
        return <main className="main-content"><div className="card">Loading users...</div></main>;
    }

    if (error) {
        return <main className="main-content"><div className="card text-red-500">{error}</div></main>;
    }

    return (
        <main className="main-content">
            <style>{pageStyles}</style>
            <div className="list-header">
                <h2>Manage Users</h2>
                <button onClick={handleAddUser} className="submit-btn">
                    <Plus size={20} /> Add New User
                </button>
            </div>
            {users.length === 0 && totalUsers === 0 ? (
                <div className="card"><p>No users found. Add your first one!</p></div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="text-center">
                                            <button onClick={() => handleEditUser(user)} className="icon-btn edit-btn">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="icon-btn delete-btn">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`pagination-btn ${number === currentPage ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userToEdit={userToEdit}
                onSave={fetchUsers}
            />
        </main>
    );
};

export default AdminUsersPage;
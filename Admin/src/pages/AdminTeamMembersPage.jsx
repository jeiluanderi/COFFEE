import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';
import AddEditTeamMemberModal from '../components/AddEditTeamMemberModal';

// Using Vite environment variables for the backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = `${backendUrl}/api/admin/baristas`;

const AdminTeamMembersPage = () => {
    // State for team members list, loading/error status, and modal
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamMemberToEdit, setTeamMemberToEdit] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Memoized function to fetch team members from the backend
    const fetchTeamMembers = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `${API_BASE_URL}?page=${currentPage}&limit=${itemsPerPage}`,
                getAuthHeaders()
            );

            // Check for valid data structure from the API
            if (response.data && response.data.baristas && response.data.totalCount) {
                setTeamMembers(response.data.baristas);
                setTotalItems(response.data.totalCount);
            } else {
                throw new Error('Invalid data structure received from API.');
            }
        } catch (err) {
            console.error('Error fetching team members:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to load team members. Please check the backend connection.');
            setTeamMembers([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    // Effect hook to re-fetch data whenever the page changes
    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    // Handlers for CRUD operations
    const handleAddTeamMember = () => {
        setTeamMemberToEdit(null); // Set to null for a new member
        setIsModalOpen(true);
    };

    const handleEditTeamMember = (teamMember) => {
        setTeamMemberToEdit(teamMember); // Pass the team member object for editing
        setIsModalOpen(true);
    };

    const handleDeleteTeamMember = async (id) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
                fetchTeamMembers(); // Re-fetch data to update the list
            } catch (err) {
                console.error('Error deleting team member:', err.response?.data || err);
                setError(err.response?.data?.message || 'Failed to delete team member.');
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // CSS styles for the component
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
        /* Pagination Styles */
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
            font-weight: 500;
            color: #4B5563;
        }
        .pagination-btn:hover:not(.active) {
            background-color: #f0f0f0;
            border-color: #ccc;
        }
        .pagination-btn.active {
            background-color: #6F4E37;
            color: white;
            border-color: #6F4E37;
            pointer-events: none;
        }
        .pagination-btn:disabled {
            cursor: not-allowed;
            opacity: 0.5;
            background-color: #f9fafb;
        }
        .pagination-btn.icon-only {
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;

    // Conditional rendering for loading and error states
    if (isLoading) {
        return <main className="main-content"><div className="card">Loading team members...</div></main>;
    }

    if (error) {
        return <main className="main-content"><div className="card text-red-500">{error}</div></main>;
    }

    return (
        <main className="main-content">
            <style>{pageStyles}</style>
            <div className="list-header">
                <h2>Manage Team Members</h2>
                <button onClick={handleAddTeamMember} className="submit-btn">
                    <Plus size={20} /> Add New Member
                </button>
            </div>

            {teamMembers.length === 0 && totalItems === 0 ? (
                <div className="card"><p>No team members found. Add your first one!</p></div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Image</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.id}</td>
                                        <td>{member.name}</td>
                                        <td>{member.role}</td>
                                        <td>
                                            <img
                                                src={member.image_url}
                                                alt={member.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <button onClick={() => handleEditTeamMember(member)} className="icon-btn edit-btn">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteTeamMember(member.id)} className="icon-btn delete-btn">
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
                                className="pagination-btn icon-only" // Added icon-only class
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
                                className="pagination-btn icon-only" // Added icon-only class
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
            <AddEditTeamMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                teamMember={teamMemberToEdit}
                onSave={fetchTeamMembers}
            />
        </main>
    );
};

export default AdminTeamMembersPage;
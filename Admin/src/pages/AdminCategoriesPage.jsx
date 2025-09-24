import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryModal from '../components/CategoryModal';
import { getAuthHeaders } from '../../utils/auth';
import './index.css';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(10);
    const [totalCategories, setTotalCategories] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    // Wrap fetchCategories in useCallback to memoize the function
    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(
                `${backendUrl}/api/categories/admin?page=${currentPage}&limit=${categoriesPerPage}`,
                getAuthHeaders() // Correct way to pass headers to a GET request
            );

            if (!response.data || !response.data.categories || response.data.totalCount === undefined) {
                throw new Error('Invalid data structure received from backend.');
            }

            setCategories(response.data.categories);
            setTotalCategories(response.data.totalCount);
        } catch (err) {
            console.error('Error fetching categories:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to load categories. Please check the backend connection.');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, currentPage, categoriesPerPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? This will affect all associated products.')) {
            return;
        }
        try {
            await axios.delete(`${backendUrl}/api/categories/admin/${id}`, getAuthHeaders()); // Correct way for DELETE
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to delete category.');
        }
    };
    
    // Function to handle saving from the modal
    const handleSave = () => {
        fetchCategories();
        setIsModalOpen(false);
    };

    // Pagination logic
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    if (isLoading) {
        return <main className="main-content"><div className="card">Loading categories...</div></main>;
    }

    if (error) {
        return <main className="main-content"><div className="card text-red-500">{error}</div></main>;
    }

    return (
        <main className="main-content">
            <div className="list-header">
                <h2>Manage Categories</h2>
                <button onClick={handleAddCategory} className="submit-btn">
                    <Plus size={20} /> Add New Category
                </button>
            </div>
            {categories.length === 0 && totalCategories === 0 ? (
                <div className="card"><p>No categories found. Add your first one!</p></div>
            ) : (
                <div className="card">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>{cat.id}</td>
                                    <td>{cat.name}</td>
                                    <td className="text-center">
                                        <button onClick={() => handleEditCategory(cat)} className="icon-btn edit-btn">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="icon-btn delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categoryToEdit={categoryToEdit}
                onSave={handleSave}
            />
        </main>
    );
};

export default AdminCategoriesPage;
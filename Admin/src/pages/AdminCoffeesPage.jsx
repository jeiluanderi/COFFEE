import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import CoffeeModal from '../components/CoffeeModal';
import { getAuthHeaders } from '../../utils/auth';
// import './AdminCoffeesPage.css';
const AdminCoffeesPage = () => {
    const [coffees, setCoffees] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coffeeToEdit, setCoffeeToEdit] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [coffeesPerPage] = useState(10);
    const [totalCoffees, setTotalCoffees] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [coffeesResponse, categoriesResponse] = await Promise.all([
                axios.get(`${backendUrl}/api/admin/coffees?page=${currentPage}&limit=${coffeesPerPage}`, getAuthHeaders()),
                axios.get(`${backendUrl}/api/categories`, getAuthHeaders()),
            ]);

            if (!coffeesResponse.data || !coffeesResponse.data.coffees || coffeesResponse.data.totalCount === undefined) {
                throw new Error('Invalid data structure received from backend.');
            }

            const categoriesMap = new Map(categoriesResponse.data.map(cat => [cat.id, cat.name]));
            setCategories(categoriesResponse.data);

            const coffeesWithCategories = coffeesResponse.data.coffees.map(coffee => ({
                ...coffee,
                category_name: categoriesMap.get(coffee.category_id) || 'Uncategorized',
            }));

            setCoffees(coffeesWithCategories);
            setTotalCoffees(coffeesResponse.data.totalCount);

        } catch (err) {
            console.error('Error fetching data:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to load data. Please check the backend connection.');
            setCoffees([]);
            setTotalCoffees(0);
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl, currentPage, coffeesPerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddCoffee = () => {
        setCoffeeToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditCoffee = (coffee) => {
        setCoffeeToEdit(coffee);
        setIsModalOpen(true);
    };

    const handleDeleteCoffee = async (id) => {
        if (window.confirm('Are you sure you want to delete this coffee?')) {
            try {
                await axios.delete(`${backendUrl}/api/admin/coffees/${id}`, getAuthHeaders());
                fetchData();
            } catch (err) {
                console.error('Error deleting coffee:', err.response?.data || err);
                setError(err.response?.data?.message || 'Failed to delete coffee.');
            }
        }
    };

    const handleSave = () => {
        fetchData();
        setIsModalOpen(false);
    };

    const totalPages = Math.ceil(totalCoffees / coffeesPerPage);

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
        return (
            <main className="main-content">
                <div className="card loading-card">Loading coffees...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="main-content">
                <div className="card error-card">{error}</div>
            </main>
        );
    }

    return (
        <main className="main-content">
            <div className="list-header">
                <h2>Manage Coffees</h2>
                <button onClick={handleAddCoffee} className="submit-btn">
                    <Plus size={20} /> Add New Coffee
                </button>
            </div>
            {coffees.length === 0 && totalCoffees === 0 ? (
                <div className="card">
                    <p>No coffees found. Add your first one!</p>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coffees.map((coffee) => (
                                    <tr key={coffee.id}>
                                        <td>{coffee.id}</td>
                                        <td>{coffee.name}</td>
                                        <td>{coffee.category_name}</td>
                                        <td>${coffee.price}</td>
                                        <td>{coffee.stock_quantity}</td>
                                        <td className="text-center">
                                            <button onClick={() => handleEditCoffee(coffee)} className="icon-btn edit-btn">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteCoffee(coffee.id)} className="icon-btn delete-btn">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
            <CoffeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                coffeeToEdit={coffeeToEdit}
                onSave={handleSave}
                categories={categories}
            />
        </main>
    );
};

export default AdminCoffeesPage;
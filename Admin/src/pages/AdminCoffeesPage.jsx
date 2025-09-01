import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';
// Assuming global styles are handled by RootLayout or index.css
// import '../../index.css';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Modal for Adding/Editing Coffees
const CoffeeModal = ({ isOpen, onClose, coffeeToEdit, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category_id: '',
        stock_quantity: '',
        origin: '',
        roast_level: ''
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        // Fetch categories for the dropdown
        const fetchCategories = async () => {
            try {
                // Categories endpoint is public, so no auth header needed here
                const response = await axios.get(`${backendUrl}/api/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories.');
            }
        };
        fetchCategories();
    }, [backendUrl]);

    useEffect(() => {
        if (coffeeToEdit) {
            setFormData({
                name: coffeeToEdit.name || '',
                description: coffeeToEdit.description || '',
                price: coffeeToEdit.price || '',
                image_url: coffeeToEdit.image_url || '',
                category_id: coffeeToEdit.category_id || '',
                stock_quantity: coffeeToEdit.stock_quantity || '',
                origin: coffeeToEdit.origin || '',
                roast_level: coffeeToEdit.roast_level || ''
            });
        } else {
            // Reset form for new coffee
            setFormData({
                name: '',
                description: '',
                price: '',
                image_url: '',
                category_id: '',
                stock_quantity: '',
                origin: '',
                roast_level: ''
            });
        }
    }, [coffeeToEdit, isOpen]); // Reset when modal opens or coffeeToEdit changes

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const dataToSend = {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity, 10),
        };

        if (isNaN(dataToSend.price) || dataToSend.price <= 0) {
            setError('Price must be a positive number.');
            return;
        }
        if (isNaN(dataToSend.stock_quantity) || dataToSend.stock_quantity < 0) {
            setError('Stock quantity must be a non-negative integer.');
            return;
        }
        if (!dataToSend.category_id) {
            setError('Please select a category.');
            return;
        }

        try {
            if (coffeeToEdit) {
                // Update existing coffee
                await axios.put(`${backendUrl}/api/admin/coffees/${coffeeToEdit.id}`, dataToSend, { headers: getAuthHeaders() });
            } else {
                // Add new coffee
                await axios.post(`${backendUrl}/api/admin/coffees`, dataToSend, { headers: getAuthHeaders() });
            }
            onSave(); // Trigger refresh in parent
            onClose(); // Close modal
        } catch (err) {
            console.error('Error saving coffee:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to save coffee. Please check your input.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}> {/* Added maxHeight and overflowY: 'auto' */}
                <div className="modal-header">
                    <h3>{coffeeToEdit ? 'Edit Coffee' : 'Add New Coffee'}</h3>
                    <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
                </div>
                {error && <p className="text-red-500 mb-3">{error}</p>}
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price ($)</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0.01" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image_url">Image URL</label>
                        <input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category_id">Category</label>
                        <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required>
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock_quantity">Stock Quantity</label>
                        <input type="number" id="stock_quantity" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required min="0" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="origin">Origin</label>
                        <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="roast_level">Roast Level</label>
                        <input type="text" id="roast_level" name="roast_level" value={formData.roast_level} onChange={handleChange} />
                    </div>
                    <button type="submit" className="submit-btn">{coffeeToEdit ? 'Update Coffee' : 'Add Coffee'}</button>
                </form>
            </div>
        </div>
    );
};


// Main AdminCoffeesPage Component
const AdminCoffeesPage = () => {
    const [coffees, setCoffees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coffeeToEdit, setCoffeeToEdit] = useState(null); // State to hold coffee being edited
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


    // Function to fetch coffees from the backend
    const fetchCoffees = async () => {
        setIsLoading(true);
        setError('');
        try {
            // This endpoint is public, so no auth token needed directly for GET /api/coffees
            const response = await axios.get(`${backendUrl}/api/coffees`);
            setCoffees(response.data);
        } catch (err) {
            console.error('Error fetching coffees:', err);
            setError('Failed to load coffees. Please ensure the backend is running and accessible.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch coffees on component mount
    useEffect(() => {
        fetchCoffees();
    }, [backendUrl]);


    // Handler for opening the Add Coffee modal
    const handleAddCoffee = () => {
        setCoffeeToEdit(null); // Clear any previous coffee data
        setIsModalOpen(true);
    };

    // Handler for opening the Edit Coffee modal
    const handleEditCoffee = (coffee) => {
        setCoffeeToEdit(coffee);
        setIsModalOpen(true);
    };

    // Handler for deleting a coffee
    const handleDeleteCoffee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coffee product? This action cannot be undone.')) {
            return; // User cancelled
        }
        try {
            // Admin endpoint for deleting coffee requires auth
            await axios.delete(`${backendUrl}/api/admin/coffees/${id}`, { headers: getAuthHeaders() });
            fetchCoffees(); // Refresh the list
        } catch (err) {
            console.error('Error deleting coffee:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to delete coffee. Check permissions.');
        }
    };

    if (isLoading) {
        return <main className="main-content"><div className="card">Loading coffees...</div></main>;
    }

    if (error) {
        return <main className="main-content"><div className="card text-red-500">{error}</div></main>;
    }

    return (
        <main className="main-content">
            <div className="list-header" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#36220B' }}>Manage Coffees</h2>
                <button onClick={handleAddCoffee} className="submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Add New Coffee
                </button>
            </div>

            {coffees.length === 0 ? (
                <div className="card">
                    <p style={{ color: '#6F4E37' }}>No coffee products found. Add your first coffee!</p>
                </div>
            ) : (
                <div className="card">
                    <table className="w-100" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#F8F5EB' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#36220B' }}>ID</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#36220B' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: '#36220B' }}>Category</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#36220B' }}>Price</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: '#36220B' }}>Stock</th>
                                <th style={{ padding: '12px', textAlign: 'center', color: '#36220B' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coffees.map((coffee) => (
                                <tr key={coffee.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                                    <td style={{ padding: '12px', color: '#6F4E37' }}>{coffee.id}</td>
                                    <td style={{ padding: '12px', fontWeight: '500', color: '#36220B' }}>{coffee.name}</td>
                                    <td style={{ padding: '12px', color: '#6F4E37' }}>{coffee.category_name || 'N/A'}</td> {/* Assuming category_name will be available or join with categories table */}
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#36220B' }}>${coffee.price?.toFixed(2)}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: '#36220B' }}>
                                        <span className={`status-badge ${coffee.stock_quantity <= 5 ? 'status-badge.pending' : 'status-badge.in-progress'}`}
                                            style={{ backgroundColor: coffee.stock_quantity <= 5 ? '#ffe0b2' : '#b3ecb3', color: coffee.stock_quantity <= 5 ? '#e65100' : '#007f00' }}>
                                            {coffee.stock_quantity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <button onClick={() => handleEditCoffee(coffee)} className="delete-btn" style={{ marginRight: '8px', color: '#8B4513' }}>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteCoffee(coffee.id)} className="delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <CoffeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                coffeeToEdit={coffeeToEdit}
                onSave={fetchCoffees} // Re-fetch coffees after saving
            />
        </main>
    );
};

export default AdminCoffeesPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';

const CoffeeModal = ({ isOpen, onClose, coffeeToEdit, onSave, categories }) => {
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
    const [error, setError] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        if (coffeeToEdit) {
            setFormData({
                name: coffeeToEdit.name || '',
                description: coffeeToEdit.description || '',
                price: coffeeToEdit.price || '',
                image_url: coffeeToEdit.image_url || '',
                category_id: coffeeToEdit.category_id?.toString() || '',
                stock_quantity: coffeeToEdit.stock_quantity || '',
                origin: coffeeToEdit.origin || '',
                roast_level: coffeeToEdit.roast_level || ''
            });
        } else {
            const defaultCategoryId = categories.length > 0 ? categories[0].id.toString() : '';
            setFormData({
                name: '',
                description: '',
                price: '',
                image_url: '',
                category_id: defaultCategoryId,
                stock_quantity: '',
                origin: '',
                roast_level: ''
            });
        }
        setError('');
    }, [coffeeToEdit, isOpen, categories]);

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
            category_id: parseInt(formData.category_id, 10),
        };

        if (isNaN(dataToSend.price) || dataToSend.price <= 0) {
            setError('Price must be a positive number.');
            return;
        }
        if (isNaN(dataToSend.stock_quantity) || dataToSend.stock_quantity < 0) {
            setError('Stock quantity must be a non-negative integer.');
            return;
        }
        if (isNaN(dataToSend.category_id)) {
            setError('Please select a valid category.');
            return;
        }

        const selectedCategory = categories.find(cat => cat.id.toString() === formData.category_id);
        if (selectedCategory?.name.toLowerCase() === 'coffee') {
            if (!formData.origin || !formData.roast_level) {
                setError('Origin and Roast Level are required for coffee products.');
                return;
            }
        }

        try {
            const headers = getAuthHeaders();

            if (coffeeToEdit) {
                await axios.put(
                    `${backendUrl}/api/admin/coffees/${coffeeToEdit.id}`,
                    dataToSend,
                    headers // This is the corrected line
                );
            } else {
                await axios.post(
                    `${backendUrl}/api/admin/coffees`,
                    dataToSend,
                    headers // This is the corrected line
                );
            }
            onSave(); // Trigger the parent's data fetch
            onClose(); // Close the modal on success
        } catch (err) {
            console.error('❌ Error saving product:', err.response?.data || err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save product.');
        }
    };

    const selectedCategoryName = categories.find(cat => cat.id.toString() === formData.category_id)?.name.toLowerCase();

    const formStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            padding: 2.5rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: fadeInScale 0.3s ease-out;
            color: #333;
        }
        @keyframes fadeInScale {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 1rem;
        }
        .modal-header h3 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #444;
        }
        .modal-close-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #888;
            transition: color 0.2s;
        }
        .modal-close-btn:hover {
            color: #555;
        }
        .modal-form .form-group {
            margin-bottom: 1.25rem;
        }
        .modal-form label {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            color: #555;
            margin-bottom: 0.5rem;
        }
        .modal-form input,
        .modal-form select,
        .modal-form textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .modal-form input:focus,
        .modal-form select:focus,
        .modal-form textarea:focus {
            outline: none;
            border-color: #6F4E37;
            box-shadow: 0 0 0 3px rgba(111, 78, 55, 0.2);
        }
        .modal-form textarea {
            resize: vertical;
            min-height: 100px;
        }
        .submit-btn {
            width: 100%;
            padding: 1rem;
            background-color: #6F4E37;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
            margin-top: 1rem;
        }
        .submit-btn:hover {
            background-color: #4F3827;
        }
        .submit-btn:active {
            transform: scale(0.99);
        }
    `;

    return (
        <div className="modal-overlay">
            <style>{formStyles}</style>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{coffeeToEdit ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="modal-close-btn"><X size={24} /></button>
                </div>
                {error && <p style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
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

                    {selectedCategoryName === 'coffee' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="origin">Origin</label>
                                <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="roast_level">Roast Level</label>
                                <input type="text" id="roast_level" name="roast_level" value={formData.roast_level} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    <button type="submit" className="submit-btn">
                        {coffeeToEdit ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CoffeeModal;
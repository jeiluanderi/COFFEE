import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';

const CategoryModal = ({ isOpen, onClose, categoryToEdit, onSave }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name || '');
        } else {
            setName('');
        }
    }, [categoryToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Category name cannot be empty.');
            return;
        }

        try {
            if (categoryToEdit) {
                // Correct axios PUT call
                await axios.put(`${backendUrl}/api/categories/admin/${categoryToEdit.id}`, { name }, getAuthHeaders());
            } else {
                // Correct axios POST call
                await axios.post(`${backendUrl}/api/categories/admin`, { name }, getAuthHeaders());
            }
            onSave();
            onClose();
        } catch (err) {
            console.error('Error saving category:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to save category. It may already exist.');
        }
    };

    return (
        <div className="modal-overlay">
            {/* The rest of the styling from the previous answer is assumed to be here or in a CSS file */}
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h3>{categoryToEdit ? 'Edit Category' : 'Add New Category'}</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>
                {error && <p className="text-red-500 mb-3">{error}</p>}
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="categoryName">Category Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">{categoryToEdit ? 'Update Category' : 'Add Category'}</button>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
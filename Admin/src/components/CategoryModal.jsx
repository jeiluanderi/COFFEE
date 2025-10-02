import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';
// Import a set of relevant Lucide icons
import {  Coffee,  Leaf, Droplets, Utensils, Cookie, PlusCircle,
    Star, ShoppingCart, Users, Settings, 
     CupSoda, Croissant,  Sandwich, Cake, IceCream, Milk,Hamburger, Pizza,IceCreamBowl,} from 'lucide-react'; 
import { getAuthHeaders } from '../../utils/auth';

// Map icon names to the actual imported components
const iconMap = {
   Coffee, 
    Leaf, 
    Droplets, 
    Utensils, 
    Cookie, 
    Pizza,
    Croissant,
    PlusCircle,
    Star, 
    ShoppingCart, 
    Users, 
    Settings, 
    CupSoda, 
    
    Sandwich,
    Hamburger,
    Cake, 
    IceCream, 
    IceCreamBowl,
    Milk, 
    
};

// List of available icon names for the dropdown
const availableIcons = Object.keys(iconMap);
// Define a clear default icon name
const DEFAULT_ICON = 'Coffee';

const CategoryModal = ({ isOpen, onClose, categoryToEdit, onSave }) => {
    const [name, setName] = useState('');
    const [iconName, setIconName] = useState(DEFAULT_ICON); // Add state for the icon
    const [error, setError] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name || '');
            // Use the saved icon_name, or fall back to the default
            setIconName(categoryToEdit.icon_name || DEFAULT_ICON); 
        } else {
            setName('');
            setIconName(DEFAULT_ICON); // Reset to the default for new categories
        }
    }, [categoryToEdit, isOpen]);

    if (!isOpen) return null;

    // Dynamically get the icon component based on the current iconName state
    const IconComponent = iconMap[iconName] || Coffee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !iconName) {
            setError('Category name and icon cannot be empty.');
            return;
        }

        // Include the iconName in the data payload
        const dataToSave = { name, icon_name: iconName }; 

        try {
            if (categoryToEdit) {
                await axios.put(`${backendUrl}/api/categories/admin/${categoryToEdit.id}`, dataToSave, getAuthHeaders());
            } else {
                await axios.post(`${backendUrl}/api/categories/admin`, dataToSave, getAuthHeaders());
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
                    
                    <div className="form-group">
                        <label htmlFor="categoryIcon">Select Icon</label>
                        <div className="flex items-center space-x-2">
                            {/* Visual preview of the selected icon */}
                            <IconComponent size={24} className="text-gray-600" /> 
                            <select
                                id="categoryIcon"
                                value={iconName}
                                onChange={(e) => setIconName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                {availableIcons.map((icon) => (
                                    <option key={icon} value={icon}>
                                        {icon}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" className="submit-btn">
                        <Save size={20} className="mr-2" />
                        {categoryToEdit ? 'Update Category' : 'Add Category'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;

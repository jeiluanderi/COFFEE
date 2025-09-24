import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus } from 'lucide-react';

const token = localStorage.getItem("token");

const ServicesAdmin = () => {
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [editingService, setEditingService] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        image_src: ''
    });
    const [addFormData, setAddFormData] = useState({
        title: '',
        description: '',
        image_src: ''
    });
    const limit = 2;

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                'http://localhost:3001/api/services',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (Array.isArray(response.data)) {
                setAllServices(response.data);
            } else {
                setError('Invalid data format received from the backend.');
            }
        } catch (err) {
            console.error('Error fetching services:', err.response?.data || err.message);
            setError('Failed to fetch services. Please ensure your backend server is running and the API endpoint is correct.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this service? This action cannot be undone.");
        if (!isConfirmed) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:3001/api/services/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchServices();
        } catch (err) {
            console.error(`Error deleting service ${id}:`, err.response?.data || err.message);
            setError('Failed to delete service. See console for details.');
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setEditFormData({
            title: service.title,
            description: service.description,
            image_src: service.image_src
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3001/api/services/${editingService.id}`,
                editFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setEditingService(null);
            fetchServices();
        } catch (err) {
            console.error('Failed to update service:', err);
            setError('Failed to update service.');
        }
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:3001/api/services',
                addFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setIsAdding(false);
            setAddFormData({ title: '', description: '', image_src: '' });
            fetchServices();
        } catch (err) {
            console.error('Failed to add service:', err);
            setError('Failed to add service.');
        }
    };
    
    const indexOfLastService = page * limit;
    const indexOfFirstService = indexOfLastService - limit;
    const currentServices = allServices.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(allServices.length / limit);

    if (loading) {
        return <div className="loading-message">Loading services...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }
    
    // Add/Edit Form Logic (Modal-like appearance)
    const renderForm = (isEditing) => (
        <div className="admin-form-container">
            <style>{`
                .admin-form-container {
                    padding: 24px;
                    background-color: #f8f5f0; /* Soft beige background */
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border: 1px solid #d4c0ae;
                    max-width: 600px;
                    margin: 2rem auto;
                }
                .admin-form h2 {
                    color: #4A2B1D; /* Deep coffee brown heading */
                    margin-bottom: 1.5rem;
                    font-size: 1.5rem;
                    border-bottom: 2px solid #a0522d; /* Sienna brown line */
                    padding-bottom: 0.5rem;
                }
                .admin-form label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #6b4e3f;
                    font-weight: 500;
                }
                .admin-form input, .admin-form textarea {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 1.5rem;
                    border: 1px solid #c0a89a;
                    border-radius: 6px;
                    font-size: 1rem;
                    background-color: #fcf9f5; /* Off-white input background */
                }
                .admin-form textarea {
                    height: 100px;
                    resize: vertical;
                }
                .admin-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                .admin-form-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .btn-save {
                    background-color: #4A2B1D;
                    color: white;
                }
                .btn-save:hover {
                    background-color: #3B2117;
                }
                .btn-cancel {
                    background-color: #a0522d;
                    color: white;
                }
                .btn-cancel:hover {
                    background-color: #8B4513;
                }
            `}</style>
            <form onSubmit={isEditing ? handleSaveEdit : handleAddSubmit} className="admin-form">
                <h2>{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={isEditing ? editFormData.title : addFormData.title}
                        onChange={isEditing ? handleEditFormChange : handleAddFormChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={isEditing ? editFormData.description : addFormData.description}
                        onChange={isEditing ? handleEditFormChange : handleAddFormChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image_src">Image URL</label>
                    <input
                        type="text"
                        id="image_src"
                        name="image_src"
                        value={isEditing ? editFormData.image_src : addFormData.image_src}
                        onChange={isEditing ? handleEditFormChange : handleAddFormChange}
                        required
                    />
                </div>
                <div className="admin-form-actions">
                    <button type="button" onClick={() => { isEditing ? setEditingService(null) : setIsAdding(false); }} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn-save">
                        {isEditing ? 'Save Changes' : 'Add Service'}
                    </button>
                </div>
            </form>
        </div>
    );

    if (isAdding || editingService) {
        return renderForm(!!editingService);
    }
    
    return (
        <div className="content-card-container">
            <style>
                {`
                .content-card-container {
                    padding: 24px;
                    background-color: #fefcf9; /* Light, warm background */
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e5d8c6;
                    margin-bottom: 2rem;
                }
                .content-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .content-card-title {
                    font-family: 'Georgia', serif;
                    font-size: 2rem;
                    font-weight: bold;
                    color: #4A2B1D; /* Deep coffee brown */
                    padding-bottom: 0.5rem;
                    display: inline-block;
                }
                .add-service-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background-color: #4A2B1D;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .add-service-button:hover {
                    background-color: #3B2117;
                }
                .item-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .item-card {
                    background-color: #fff;
                    padding: 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #d4c0ae;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    text-align: center;
                }
                .item-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }
                .service-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }
                .service-title {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: #4A2B1D;
                    margin-bottom: 0.25rem;
                }
                .service-description {
                    font-size: 0.9rem;
                    color: #7d6b5e;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                }
                .card-footer {
                    display: flex;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }
                .action-button {
                    padding: 0.5rem;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .btn-edit {
                    background-color: #A0522D; /* Sienna brown */
                    color: white;
                }
                .btn-edit:hover {
                    background-color: #8B4513; /* Darker sienna */
                }
                .btn-delete {
                    background-color: #B5651D; /* Warm orange-brown */
                    color: white;
                }
                .btn-delete:hover {
                    background-color: #9C581A;
                }
                .loading-message,
                .error-message,
                .empty-state {
                    text-align: center;
                    padding: 2rem;
                    color: #6b4e3f;
                    font-size: 1rem;
                }
                .pagination-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .pagination-button {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: 1px solid #d4c0ae;
                    background-color: #f5f0e8; /* Light beige */
                    color: #4A2B1D;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .pagination-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .pagination-button:hover:not(:disabled) {
                    background-color: #e5d8c6;
                }
                .page-info {
                    font-weight: bold;
                    color: #4A2B1D;
                }
                `}
            </style>
            <div className="content-card-header">
                <h2 className="content-card-title">Manage Services</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="add-service-button"
                    aria-label="Add New Service"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>
            
            {currentServices.length === 0 ? (
                <div className="empty-state">
                    <p className="empty-text">No services found. Add a new one to get started.</p>
                </div>
            ) : (
                <div className="item-grid">
                    {currentServices.map((service) => (
                        <div key={service.id} className="item-card">
                            <div>
                                <img src={service.image_src} alt={service.title} className="service-image" />
                                <h4 className="service-title">{service.title}</h4>
                                <p className="service-description">{service.description}</p>
                            </div>
                            <div className="card-footer">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="action-button btn-edit"
                                    aria-label="Edit Service"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="action-button btn-delete"
                                    aria-label="Delete Service"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination-controls">
                <button
                    onClick={() => setPage(page => Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span className="page-info">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage(page => Math.min(totalPages, page + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ServicesAdmin;
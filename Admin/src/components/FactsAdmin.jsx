import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, XCircle } from 'lucide-react';
import axios from 'axios';

// Modal component for adding/editing facts
const FactModal = ({ isOpen, onClose, onSubmit, fact, isEditing }) => {
    const [formData, setFormData] = useState({
        number: '',
        text: '',
    });

    useEffect(() => {
        if (fact) {
            setFormData(fact);
        } else {
            setFormData({ number: '', text: '' });
        }
    }, [fact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <style>
                {`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .modal-content {
                        background-color: #fff;
                        padding: 24px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        width: 90%;
                        max-width: 500px;
                        animation: fadeIn 0.3s ease-out;
                    }
                    .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #e0e0e0;
                        padding-bottom: 16px;
                        margin-bottom: 24px;
                    }
                    .modal-title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #4A2B1D;
                    }
                    .modal-close-icon {
                        cursor: pointer;
                        color: #666;
                        transition: color 0.2s ease;
                    }
                    .modal-close-icon:hover {
                        color: #000;
                    }
                    .modal-form input {
                        width: 100%;
                        padding: 12px;
                        margin-bottom: 16px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-sizing: border-box;
                    }
                    .btn-primary {
                        display: inline-block;
                        width: 100%;
                        padding: 12px;
                        background-color: #4A2B1D;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.2s ease;
                    }
                    .btn-primary:hover {
                        background-color: #3B2117;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{isEditing ? 'Edit Fact' : 'Add New Fact'}</h2>
                    <XCircle size={24} className="modal-close-icon" onClick={onClose} />
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        name="number"
                        placeholder="Fact Number (e.g., '100+')"
                        value={formData.number}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="text"
                        placeholder="Fact Text (e.g., 'Happy Customers')"
                        value={formData.text}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Update Fact' : 'Create Fact'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Main Facts Admin Component
const FactsAdmin = () => {
    const [facts, setFacts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFact, setCurrentFact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchFacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/facts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (Array.isArray(response.data)) {
                setFacts(response.data);
            } else {
                console.error('API response is not an array:', response.data);
                setFacts([]);
            }
        } catch (error) {
            console.error('Error fetching facts:', error);
            setFacts([]);
        }
    };

    useEffect(() => {
        fetchFacts();
    }, []);

    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentFact(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (fact) => {
        setIsEditing(true);
        setCurrentFact(fact);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this fact?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/facts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchFacts();
            } catch (error) {
                console.error('Error deleting fact:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await axios.put(`/api/admin/facts/${currentFact.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/admin/facts', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchFacts();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="content-card-container">
            <style>
                {`
                .content-card-container {
                    padding: 24px;
                    background-color: #f8f9fa;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e0e0e0;
                    margin-bottom: 2rem;
                }
                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .btn-primary {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background-color: #4A2B1D; /* A deep coffee brown */
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .btn-primary:hover {
                    background-color: #3B2117; /* A darker shade for hover */
                }
                .item-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 24px;
                }
                .item-card {
                    background-color: #fff;
                    padding: 24px;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5d8c6; /* A light beige border */
                    text-align: center;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .item-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }
                .item-card p.fact-number {
                    font-size: 2.5rem; /* Larger font size */
                    font-weight: bold;
                    color: #4A2B1D; /* Coffee brown number */
                    margin-bottom: 8px;
                }
                .item-card p.fact-text {
                    font-size: 1rem;
                    font-weight: 500;
                    color: #7d6b5e; /* Muted brown for text */
                    margin-bottom: 16px;
                }
                .card-footer {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .btn-edit, .btn-delete {
                    padding: 8px;
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
                    background-color: #A0522D; /* Sienna brown for edit button */
                    color: white;
                }
                .btn-edit:hover {
                    background-color: #8B4513; /* Darker brown for hover */
                }
                .btn-delete {
                    background-color: #B5651D; /* A warm, spicy orange-brown */
                    color: white;
                }
                .btn-delete:hover {
                    background-color: #9C581A;
                }
                .admin-header {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #4A2B1D;
                }
                .admin-description {
                    color: #7d6b5e;
                    margin-bottom: 1.5rem;
                }
                `}
            </style>

            <div className="header-row">
                <div>
                    <h2 className="admin-header">Manage Key Facts </h2>
                    
                </div>
                <button onClick={handleCreateClick} className="btn-primary">
                    <PlusCircle size={20} />
                    New Fact
                </button>
            </div>
            
            <FactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                fact={currentFact}
                isEditing={isEditing}
            />

            <div className="item-grid">
                {Array.isArray(facts) && facts.length > 0 ? (
                    facts.map((fact) => (
                        <div key={fact.id} className="item-card">
                            <p className="fact-number">{fact.number}</p>
                            <p className="fact-text">{fact.text}</p>
                            <div className="card-footer">
                                <button className="btn-edit" onClick={() => handleEditClick(fact)}>
                                    <Edit size={18} />
                                </button>
                                <button className="btn-delete" onClick={() => handleDeleteClick(fact.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No facts found. Add a new one to get started.</p>
                )}
            </div>
        </div>
    );
};

export default FactsAdmin;
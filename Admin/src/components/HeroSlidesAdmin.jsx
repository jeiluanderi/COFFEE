import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, XCircle } from 'lucide-react';
import axios from 'axios';

// Modal component for adding/editing hero slides
const HeroSlideModal = ({ isOpen, onClose, onSubmit, slide, isEditing }) => {
    const [formData, setFormData] = useState({
        image_src: '',
        title: '',
        button_text: '',
        button_href: '',
    });

    useEffect(() => {
        if (slide) {
            setFormData(slide);
        } else {
            setFormData({ image_src: '', title: '', button_text: '', button_href: '' });
        }
    }, [slide]);

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
                        color: #4A2B1D; /* A deep coffee brown */
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
                        background-color: #4A2B1D; /* A deep coffee brown */
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.2s ease;
                    }
                    .btn-primary:hover {
                        background-color: #3B2117; /* A darker shade for hover */
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{isEditing ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h2>
                    <XCircle size={24} className="modal-close-icon" onClick={onClose} />
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        name="image_src"
                        placeholder="Image URL"
                        value={formData.image_src}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="button_text"
                        placeholder="Button Text"
                        value={formData.button_text}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="button_href"
                        placeholder="Button Link"
                        value={formData.button_href}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Update Slide' : 'Create Slide'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Main Hero Slides Admin Component
const HeroSlidesAdmin = () => {
    const [slides, setSlides] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchSlides = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/hero-slides', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (Array.isArray(response.data)) {
                setSlides(response.data);
            } else {
                console.error('API response is not an array:', response.data);
                setSlides([]);
            }
        } catch (error) {
            console.error('Error fetching hero slides:', error);
            setSlides([]);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentSlide(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (slide) => {
        setIsEditing(true);
        setCurrentSlide(slide);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/hero-slides/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchSlides(); 
            } catch (error) {
                console.error('Error deleting hero slide:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await axios.put(`/api/admin/hero-slides/${currentSlide.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/admin/hero-slides', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchSlides(); 
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
                .content-card-container .header-row {
                    display: flex;
                    justify-content: space-between; /* Changed from flex-end */
                    align-items: center;
                    margin-bottom: 24px;
                }
                .content-card-title {
                    font-family: 'Georgia', serif;
                    font-size: 2rem;
                    font-weight: bold;
                    color: #4A2B1D;
                    padding-bottom: 0.5rem;
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
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
                .item-card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 16px;
                }
                .item-card h4 {
                    font-weight: bold;
                    font-size: 1.125rem;
                    color: #4A2B1D; /* Coffee brown heading */
                    margin-bottom: 8px;
                }
                .item-card p {
                    font-size: 0.875rem;
                    color: #7d6b5e; /* Muted brown for description */
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
                `}
            </style>

            <div className="header-row">
                <h2 className="content-card-title">Manage Slides</h2>
                <button onClick={handleCreateClick} className="btn-primary">
                    <PlusCircle size={20} />
                    New Slide
                </button>
            </div>
            
            <HeroSlideModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                slide={currentSlide}
                isEditing={isEditing}
            />

            <div className="item-grid">
                {Array.isArray(slides) && slides.length > 0 ? (
                    slides.map((slide) => (
                        <div key={slide.id} className="item-card">
                            <img src={slide.image_src} alt={slide.title} />
                            <h4>{slide.title}</h4>
                            <p>{slide.button_text}</p>
                            <div className="card-footer">
                                <button className="btn-edit" onClick={() => handleEditClick(slide)}>
                                    <Edit size={18} />
                                </button>
                                <button className="btn-delete" onClick={() => handleDeleteClick(slide.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hero slides found. Add a new one to get started.</p>
                )}
            </div>
        </div>
    );
};

export default HeroSlidesAdmin;
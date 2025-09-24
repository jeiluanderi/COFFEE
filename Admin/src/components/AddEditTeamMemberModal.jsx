import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = `${backendUrl}/api/admin/baristas`;

const AddEditTeamMemberModal = ({ isOpen, onClose, teamMember, onSave }) => {
    // State for form data, loading, and error
    const [formData, setFormData] = useState({ name: '', role: '', image_url: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Effect hook to populate form data when a team member is passed for editing
    useEffect(() => {
        if (teamMember) {
            setFormData({
                name: teamMember.name,
                role: teamMember.role,
                image_url: teamMember.image_url || '',
            });
        } else {
            // Reset form for adding a new team member
            setFormData({ name: '', role: '', image_url: '' });
        }
    }, [teamMember]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission (add or edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Prepare data to send to the backend
        const payload = {
            name: formData.name,
            role: formData.role,
            image_url: formData.image_url,
        };

        try {
            if (teamMember) {
                // Edit existing team member
                await axios.put(`${API_BASE_URL}/${teamMember.id}`, payload, getAuthHeaders());
            } else {
                // Add new team member
                await axios.post(API_BASE_URL, payload, getAuthHeaders());
            }
            onSave(); // Trigger a re-fetch of the list
            onClose(); // Close the modal
        } catch (err) {
            console.error('Submission error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to save team member. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // If modal is not open, don't render anything
    if (!isOpen) {
        return null;
    }
    
    return (
        <div className="modal-overlay">
            <style jsx="true">{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease-out;
                    overflow-y: auto; /* Allow scrolling on the overlay */
                }
                .modal-container {
                    background-color: #F8F4EC;
                    padding: 2.5rem;
                    border-radius: 1.5rem;
                    width: 90%;
                    max-width: 550px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    position: relative;
                    font-family: 'Inter', sans-serif;
                    transform: scale(1);
                    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                    border: 2px solid #6F4E37;
                    max-height: 90vh; /* Set a max height */
                    overflow-y: auto; /* Make the container itself scrollable */
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #D4B2A1;
                    padding-bottom: 1.5rem;
                    margin-bottom: 2rem;
                    position: sticky; /* Keep header visible on scroll */
                    top: -2.5rem; /* Offset for padding */
                    background-color: #F8F4EC;
                    z-index: 10;
                    padding-top: 2.5rem;
                    margin-top: -2.5rem;
                }
                .modal-header h3 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #3C2F2F;
                }
                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #A3A3A3;
                    transition: color 0.2s, transform 0.2s;
                }
                .close-btn:hover {
                    color: #6B7280;
                    transform: rotate(90deg);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: #57534E;
                }
                .form-group input {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    background-color: #FFF;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .form-group input:focus {
                    outline: none;
                    border-color: #6F4E37;
                    box-shadow: 0 0 0 4px rgba(111, 78, 55, 0.2);
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1.25rem;
                    margin-top: 3rem;
                    position: sticky; /* Keep actions visible on scroll */
                    bottom: -2.5rem; /* Offset for padding */
                    background-color: #F8F4EC;
                    padding-bottom: 2.5rem;
                    margin-bottom: -2.5rem;
                }
                .cancel-btn, .save-btn {
                    padding: 1rem 2rem;
                    border-radius: 9999px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .cancel-btn {
                    background-color: #E5E7EB;
                    color: #4B5563;
                }
                .cancel-btn:hover {
                    background-color: #D1D5DB;
                }
                .save-btn {
                    background-color: #6F4E37;
                    color: white;
                }
                .save-btn:hover {
                    background-color: #4F3827;
                    transform: translateY(-2px);
                }
                .error-message {
                    color: #C02626;
                    background-color: #FEE2E2;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    border: 1px solid #FCA5A5;
                }
                .image-preview-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .image-preview {
                    margin-top: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .image-preview img {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #6F4E37;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
            `}</style>
            <div className="modal-container">
                <div className="modal-header">
                    <h3>{teamMember ? 'Edit Team Member' : 'Add New Member'}</h3>
                    <button onClick={onClose} className="close-btn" aria-label="Close modal">
                        <X size={28} strokeWidth={2.5} />
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., Jane Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., Head Barista"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image_url">Profile Image URL (Cloudinary)</label>
                        <input
                            type="url"
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            placeholder="https://res.cloudinary.com/your-cloud/image.jpg"
                        />
                        {formData.image_url && (
                            <div className="image-preview-container">
                                <div className="image-preview">
                                    <img src={formData.image_url} alt="Profile preview" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? 'Saving...' : <><Save size={18} /> Save</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditTeamMemberModal;
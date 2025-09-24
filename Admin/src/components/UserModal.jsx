import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { getAuthHeaders } from '../../utils/auth';

Modal.setAppElement('#root'); // This line is crucial for accessibility

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: 'none',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

const UserModal = ({ isOpen, onClose, userToEdit, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'customer',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                username: userToEdit.username,
                email: userToEdit.email,
                role: userToEdit.role,
                password: '', // Never pre-fill passwords
            });
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'customer',
            });
        }
    }, [userToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (userToEdit) {
                // Update existing user
                await axios.put(`${backendUrl}/api/admin/users/${userToEdit.id}`, formData, getAuthHeaders());
            } else {
                // Create new user
                await axios.post(`${backendUrl}/api/admin/users`, formData, getAuthHeaders());
            }
            onSave();
            onClose();
        } catch (err) {
            console.error('Error saving user:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to save user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel={userToEdit ? 'Edit User' : 'Add New User'}
        >
            <style jsx>{`
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 1rem;
                    margin-bottom: 1.5rem;
                }
                .modal-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                }
                .form-group label {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    display: block;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }
            `}</style>
            <div className="modal-header">
                <h2 className="modal-title">{userToEdit ? 'Edit User' : 'Add New User'}</h2>
                <button className="btn-close" onClick={onClose}></button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3 form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required={!userToEdit} />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="role">Role</label>
                    <select className="form-control" id="role" name="role" value={formData.role} onChange={handleChange}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="d-flex justify-content-end form-actions">
                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save User'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UserModal;
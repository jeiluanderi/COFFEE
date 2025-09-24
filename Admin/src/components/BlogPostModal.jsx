import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { getAuthHeaders } from '../../utils/auth';

// Set the app element for react-modal
Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '700px',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        border: 'none',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

const BlogPostModal = ({ isOpen, onClose, postToEdit, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        image_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        if (postToEdit) {
            setFormData({
                title: postToEdit.title,
                content: postToEdit.content,
                author: postToEdit.author,
                image_url: postToEdit.image_url
            });
        } else {
            setFormData({ title: '', content: '', author: '', image_url: '' });
        }
    }, [postToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (postToEdit) {
                // Update existing post
                await axios.put(`${backendUrl}/api/admin/blogs/${postToEdit.id}`, formData, getAuthHeaders());
            } else {
                // Create new post
                await axios.post(`${backendUrl}/api/admin/blogs`, formData, getAuthHeaders());
            }
            onSave(); // Trigger data refresh in the parent component
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error saving blog post:', err);
            setError('Failed to save blog post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel={postToEdit ? "Edit Blog Post" : "Add New Blog Post"}
        >
            <style jsx>{`
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #D2B48C;
                    padding-bottom: 1rem;
                    margin-bottom: 1.5rem;
                }
                .modal-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: #6F4E37;
                }
                .form-group label {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    display: block;
                    color: #36220B;
                }
                .form-control {
                    border: 1px solid #D2B48C;
                    background-color: #F8F5EB;
                    border-radius: 4px;
                    padding: 0.75rem;
                    color: #36220B;
                }
                .form-control:focus {
                    border-color: #6F4E37;
                    box-shadow: 0 0 0 0.25rem rgba(111, 78, 55, 0.25);
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }
                .btn-primary {
                    background-color: #6F4E37;
                    border-color: #6F4E37;
                    transition: background-color 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #36220B;
                }
                .btn-secondary {
                    background-color: #D2B48C;
                    border-color: #D2B48C;
                    color: #36220B;
                }
                .btn-secondary:hover {
                    background-color: #C1A384;
                }
            `}</style>
            <div className="modal-header">
                <h2 className="modal-title">{postToEdit ? "Edit Blog Post" : "Add New Blog Post"}</h2>
                <button className="btn-close" onClick={onClose}></button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3 form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="author">Author</label>
                    <input type="text" className="form-control" id="author" name="author" value={formData.author} onChange={handleChange} required />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="image_url">Image URL</label>
                    <input type="text" className="form-control" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="content">Content</label>
                    <textarea className="form-control" id="content" name="content" rows="6" value={formData.content} onChange={handleChange} required></textarea>
                </div>
                <div className="d-flex justify-content-end form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default BlogPostModal;
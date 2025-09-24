// src/frontend/components/TestimonialSubmissionModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from 'lucide-react'; 

const TestimonialSubmissionModal = ({ isOpen, onClose, onSubmitted }) => {
    const [formData, setFormData] = useState({
        quote: '',
        profession: '',
        imageUrl: '',
    });
    const [status, setStatus] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const token = localStorage.getItem('token'); 
            
            await axios.post(
                `${apiUrl}/api/testimonials`,
                {
                    quote: formData.quote,
                    profession: formData.profession,
                    imageUrl: formData.imageUrl,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus('Your testimonial has been submitted for review! Thank you.');
            setFormData({ quote: '', profession: '', imageUrl: '' });
            
            setTimeout(() => {
                onClose();
                onSubmitted();
            }, 3000);
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('Failed to submit. Please ensure you are logged in and try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}><XCircle /></button>
                <h2 className="text-center font-bold">Submit Your Testimonial</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <label htmlFor="quote" className="block mb-2">Your Story:</label>
                    <textarea
                        id="quote"
                        name="quote"
                        value={formData.quote}
                        onChange={handleChange}
                        rows="5"
                        className="w-full p-2 border rounded-md"
                        required
                    />

                    <label htmlFor="profession" className="block mb-2 mt-4">Your Profession:</label>
                    <input
                        type="text"
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />

                    <label htmlFor="imageUrl" className="block mb-2 mt-4">Image URL (e.g., from Cloudinary):</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., https://res.cloudinary.com/.../your_image.jpg"
                    />

                    <button type="submit" className="btn mt-4 w-full text-white" style={{ backgroundColor: '#8B4513' }}>
                        Submit
                    </button>
                    {status && <p className="mt-2 text-sm text-center">{status}</p>}
                </form>
            </div>

            {/* Internal CSS for the modal */}
            <style jsx>{`
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
                    background-color: #f8f5eb;
                    padding: 2.5rem;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    position: relative;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #36220B;
                }
                .text-center {
                    text-align: center;
                }
                .font-bold {
                    font-weight: bold;
                }
                .mt-4 {
                    margin-top: 1rem;
                }
                .w-full {
                    width: 100%;
                }
                .p-2 {
                    padding: 0.5rem;
                }
                .border {
                    border: 1px solid #ccc;
                }
                .rounded-md {
                    border-radius: 0.375rem;
                }
                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    opacity: 0.9;
                }
                .block {
                    display: block;
                }
                .mb-2 {
                    margin-bottom: 0.5rem;
                }
                .mt-2 {
                    margin-top: 0.5rem;
                }
                .text-sm {
                    font-size: 0.875rem;
                }
                .text-white {
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default TestimonialSubmissionModal;
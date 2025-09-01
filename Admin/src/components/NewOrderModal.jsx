import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import '../index.css';


const NewOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
    // State for form inputs and submission status
    const [customerName, setCustomerName] = useState('');
    const [items, setItems] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for showing success or error messages
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    // If the modal is not open, don't render it at all
    if (!isOpen) {
        return null;
    }

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        // Prevent the default form submission to avoid page reload
        e.preventDefault();

        // Log to confirm the function is being called
        console.log("Attempting to submit form...");

        // Set loading states
        setIsSubmitting(true);
        setIsSuccess(false);
        setIsError(false);

        try {
            // Check if form fields are valid before sending the request
            if (!customerName || items === '') {
                setIsError(true);
                return;
            }

            // Post the new order data to the backend API
            const response = await axios.post('http://localhost:3001/api/orders', {
                customerName,
                items,
                status: 'In Progress' // Default status for a new order
            });

            console.log("New order created:", response.data);
            setIsSuccess(true);
            onOrderCreated(); // Trigger the re-fetch in the parent component

            // Clear the form fields after successful submission
            setCustomerName('');
            setItems('');
        } catch (error) {
            console.error("Error creating new order:", error);
            setIsError(true);
        } finally {
            setIsSubmitting(false);

            // Close the modal after a short delay so the user can see the message
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="card modal-container">
                <div className="modal-header">
                    <h3>Create New Order</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Conditional rendering for success or error messages */}
                    {isSuccess && (
                        <div className="text-center text-green-500 font-bold mb-4">
                            Order created successfully! 🎉
                        </div>
                    )}
                    {isError && (
                        <div className="text-center text-red-500 font-bold mb-4">
                            Failed to create order. Please check the backend.
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name</label>
                        <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="items">Number of Items</label>
                        <input
                            id="items"
                            type="number"
                            value={items}
                            onChange={(e) => setItems(e.target.value)}
                            required
                        />
                    </div>
                    {/* The button's type is submit to trigger the form's onSubmit event */}
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewOrderModal;

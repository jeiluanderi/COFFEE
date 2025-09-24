import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CreateOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [serviceType, setServiceType] = useState('delivery'); // Default to 'delivery'
    const [selectedItems, setSelectedItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setCustomerName('');
            setCustomerEmail('');
            setShippingAddress('');
            setPhoneNumber('');
            setServiceType('delivery');
            setSelectedItems([]);
            setError('');
            return;
        }

        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                const response = await axios.get(`${backendUrl}/api/coffees`, getAuthHeaders());
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err.response?.data || err);
                setError("Failed to load products.");
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [isOpen]);

    const handleAddItem = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            const existingItem = selectedItems.find(item => item.id === product.id);
            if (existingItem) {
                setSelectedItems(selectedItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                ));
            } else {
                setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
            }
        }
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        setSelectedItems(selectedItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0));
    };

    const handleRemoveItem = (productId) => {
        setSelectedItems(selectedItems.filter(item => item.id !== productId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!customerName.trim() || !customerEmail.trim() || selectedItems.length === 0) {
            setError('Customer name, email, and at least one item are required.');
            setIsSubmitting(false);
            return;
        }

        // Calculate total price based on selected items
        const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Map frontend data to the backend's expected structure
        const cartItems = selectedItems.map(item => ({
            coffee_id: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        const orderData = {
            customerName,
            customerEmail,
            totalPrice,
            cartItems,
            shipping_address: shippingAddress,
            phone_number: phoneNumber,
            service_type: serviceType
        };

        try {
            await axios.post(`${backendUrl}/api/orders`, orderData, getAuthHeaders());
            onOrderCreated();
            onClose();
        } catch (err) {
            console.error("Error creating order:", err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to create order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Create New Order</h3>
                    <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="customerName">Customer Name</label>
                        <input
                            type="text"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerEmail">Customer Email</label>
                        <input
                            type="email"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="serviceType">Service Type</label>
                        <select
                            id="serviceType"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="delivery">Delivery</option>
                            <option value="pickup">Pickup</option>
                        </select>
                    </div>
                    {serviceType === 'delivery' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="shippingAddress">Shipping Address</label>
                                <input
                                    type="text"
                                    id="shippingAddress"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    required={serviceType === 'delivery'}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required={serviceType === 'delivery'}
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label htmlFor="productSelect">Add Products</label>
                        {isLoadingProducts ? (
                            <p>Loading products...</p>
                        ) : (
                            <div className="item-selection-container">
                                <select id="productSelect" onChange={(e) => handleAddItem(e.target.value)} value="">
                                    <option value="" disabled>Select a product</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - ${product.price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {selectedItems.length > 0 && (
                        <div>
                            <h4>Order Items</h4>
                            <ul className="selected-items-list">
                                {selectedItems.map(item => (
                                    <li key={item.id}>
                                        <span>{item.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                className="item-quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                                                min="1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="remove-item-btn"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="total-price-display">
                                <strong>Total Price:</strong> ${selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                            </div>
                        </div>
                    )}
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : <><Save size={18} /> Create Order</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;
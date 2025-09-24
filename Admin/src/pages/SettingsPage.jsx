import React, { useState, useEffect } from 'react';

// This is the main component for the admin settings page.
const SettingsPage = () => {
    // State to hold all the settings data.
    const [settings, setSettings] = useState({
        general: {
            storeName: '',
            storeDescription: '',
            businessHours: {},
        },
        ecommerce: {
            onlineOrdering: false,
            pickupInstructions: '',
        },
        products: [],
    });

    // State for the product form.
    const [productForm, setProductForm] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
    });

    // State for handling confirmation and alerts
    const [message, setMessage] = useState(null);

    // API base URL for the Node.js backend.
    const apiBaseUrl = 'http://127.0.0.1:3001/api/admin/settings';

    // Fetch settings from the backend on component mount.
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(apiBaseUrl);
                if (!response.ok) throw new Error('Failed to fetch settings');
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
                setMessage({ type: 'error', text: 'Could not load settings. Please ensure the backend server is running.' });
            }
        };
        fetchSettings();
    }, []);

    // Handle input changes for general and e-commerce settings.
    const handleSettingsChange = (e) => {
        const { id, value, type, checked } = e.target;
        if (id in settings.general || id.endsWith('-hours')) {
            // Handle business hours separately.
            if (id.endsWith('-hours')) {
                const day = id.replace('-hours', '');
                setSettings(prev => ({
                    ...prev,
                    general: {
                        ...prev.general,
                        businessHours: {
                            ...prev.general.businessHours,
                            [day]: value,
                        },
                    },
                }));
            } else {
                setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, [id]: value },
                }));
            }
        } else if (id in settings.ecommerce) {
            setSettings(prev => ({
                ...prev,
                ecommerce: {
                    ...prev.ecommerce,
                    [id]: type === 'checkbox' ? checked : value,
                },
            }));
        }
    };

    // Handle input changes for the product form.
    const handleProductFormChange = (e) => {
        const { id, value } = e.target;
        setProductForm(prev => ({ ...prev, [id]: value }));
    };

    // Handle product form submission.
    const handleProductSubmit = async (e) => {
            e.preventDefault();
            const isEditing = !!productForm.id;
            const action = isEditing ? 'update' : 'add';

            const product = {
                id: isEditing ? productForm.id : Date.now().toString(),
                name: productForm.name,
                description: productForm.description,
                price: parseFloat(productForm.price),
                stock: parseInt(productForm.stock),
                imageUrl: productForm.imageUrl,
            };

            try {
                const response = await fetch(apiBaseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ products: [product], action }),
                });
                if (!response.ok) throw new Error('Failed to save product');

                setMessage({ type: 'success', text: 'Product saved successfully!' });
                setProductForm({ id: null, name: '', description: '', price: '', stock: '', imageUrl: '' });
                // Re-fetch data to update the UI
                const updatedSettings = await (await fetch(apiBaseUrl)).json();
                setSettings(updatedSettings);
            } catch (error) {
                console.error('Error saving product:', error);
                setMessage({ type: 'error', text: 'Error saving product. Check console for details.' });
            }
    };

    // Function to handle product deletion.
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: [{ id }], action: 'delete' }),
            });
            if (!response.ok) throw new Error('Failed to delete product');

            setMessage({ type: 'success', text: 'Product deleted successfully!' });
            // Re-fetch data to update the UI
            const updatedSettings = await (await fetch(apiBaseUrl)).json();
            setSettings(updatedSettings);
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage({ type: 'error', text: 'Error deleting product. Check console for details.' });
        }
    };

    // Function to handle editing a product.
    const handleEditProduct = (product) => {
        setProductForm({ ...product, price: product.price.toString(), stock: product.stock.toString() });
    };

    // Function to save all settings.
    const handleSaveAllSettings = async () => {
        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings, action: 'update' }),
            });
            if (!response.ok) throw new Error('Failed to save settings');

            setMessage({ type: 'success', text: 'All settings saved successfully!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Error saving settings. Check console for details.' });
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="container">
            <style>
                {`
                    .container {
                        padding: 2rem ;
                        font-family: 'Inter', sans-serif;
                        min-height: 100vh;
                        background-color: #f3e5d8;

                    }
                    .message-box {
                        position: fixed;
                        top: 1rem;
                        right: 1rem;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        color: white;
                        z-index: 1000;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        animation: fadein 0.5s, fadeout 0.5s 2.5s;
                    }
                    .message-box.success {
                        background-color: #4CAF50;
                    }
                    .message-box.error {
                        background-color: #F44336;
                    }
                    @keyframes fadein {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeout {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 2.5rem;
                    }
                    .header h1 {
                        font-size: 2.25rem;
                        font-weight: 800;
                        color: #4a3222;
                    }
                    .header p {
                        font-size: 1.125rem;
                        color: #4b5563;
                        margin-top: 0.5rem;
                        font-weight: 500;
                    }
                    .main-content {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                         width: 90%; /* Use a percentage to allow expansion */
    max-width: none;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .card {
                        background-color: white;
                        border-radius: 1rem;
                        padding: 1.5rem;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        border-top: 4px solid #6c4b38;
                    }
                    .card h2 {
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 1rem;
                        color: #6c4b38;
                    }
                    .card p {
                        font-size: 0.875rem;
                        color: #6b7280;
                        margin-bottom: 1.5rem;
                    }
                    .form-section {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .form-group label {
                        display: block;
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: #4b5563;
                        margin-bottom: 0.25rem;
                    }
                    .input-field {
                        border: 1px solid #d1d5db;
                        border-radius: 0.5rem;
                        padding: 0.5rem;
                        width: 100%;
                        transition: all 0.2s;
                    }
                    .input-field:focus {
                        outline: none;
                        border-color: #9c7b5a;
                        box-shadow: 0 0 0 2px rgba(156, 123, 90, 0.5);
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    @media (min-width: 640px) {
                        .grid-2 {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }
                    }
                    .button {
                        padding: 0.75rem 1rem;
                        border-radius: 0.5rem;
                        font-weight: 500;
                        transition: background-color 0.2s;
                    }
                    .button.primary {
                        background-color: #4a3222;
                        color: white;
                    }
                    .button.primary:hover {
                        background-color: #6c4b38;
                    }
                    .button.secondary {
                        background-color: #e5e7eb;
                        color: #4b5563;
                    }
                    .button.secondary:hover {
                        background-color: #d1d5db;
                    }
                    .button.edit {
                        background-color: #c2a27d;
                        color: white;
                        padding: 0.25rem 0.75rem;
                        font-size: 0.875rem;
                    }
                    .button.edit:hover {
                        background-color: #a58968;
                    }
                    .button.delete {
                        background-color: #ef4444;
                        color: white;
                        padding: 0.25rem 0.75rem;
                        font-size: 0.875rem;
                    }
                    .button.delete:hover {
                        background-color: #dc2626;
                    }
                    .product-item {
                        background-color: #fff9f4;
                        border-radius: 0.5rem;
                        padding: 1rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    }
                    @media (min-width: 640px) {
                        .product-item {
                            flex-direction: row;
                            justify-content: space-between;
                            text-align: left;
                        }
                    }
                    .product-image {
                        flex-shrink: 0;
                        width: 6rem;
                        height: 6rem;
                        overflow: hidden;
                        border-radius: 0.375rem;
                        border: 1px solid #9c7b5a;
                        object-fit: cover;
                    }
                    .product-info {
                        flex: 1;
                        text-align: center;
                    }
                    @media (min-width: 640px) {
                        .product-info {
                            text-align: left;
                        }
                    }
                    .product-info h3 {
                        font-size: 1.125rem;
                        font-weight: bold;
                        color: #4a3222;
                    }
                    .product-info p {
                        font-size: 0.875rem;
                        color: #6b7280;
                        margin-top: 0.25rem;
                    }
                    .product-info .details {
                        font-weight: 600;
                        color: #6c4b38;
                        margin-top: 0.25rem;
                    }
                    .product-actions {
                        flex-shrink: 0;
                        display: flex;
                        gap: 0.5rem;
                        justify-content: center;
                    }
                    .save-button-container {
                        text-align: center;
                        margin-top: 2rem;
                    }
                    .save-button {
                        background-color: #9c7b5a;
                        color: white;
                        font-weight: bold;
                        padding: 0.75rem 2rem;
                        border-radius: 0.5rem;
                        font-size: 1.125rem;
                        transition: background-color 0.2s;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    }
                    .save-button:hover {
                        background-color: #8d6c4e;
                    }
                    .empty-list {
                        color: #6b7280;
                        text-align: center;
                        padding-top: 1rem;
                        padding-bottom: 1rem;
                        font-style: italic;
                    }
                `}
            </style>
            
            {message && (
                <div className={`message-box ${message.type}`}>
                    {message.text}
                </div>
            )}

            <header className="header">
                <h1>☕ Admin Dashboard</h1>
                <p>Manage your shop's digital presence and products.</p>
            </header>

            <main className="main-content">
                {/* General Store Settings Card */}
                <section id="general-settings" className="card">
                    <h2>General Store Settings ⚙️</h2>
                    <p>Update your store's basic information and business hours.</p>
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="storeName">Store Name</label>
                            <input
                                type="text"
                                id="storeName"
                                value={settings.general.storeName}
                                onChange={handleSettingsChange}
                                className="input-field"
                                placeholder="e.g., The Daily Grind Coffee Co."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="storeDescription">Store Description</label>
                            <textarea
                                id="storeDescription"
                                rows="3"
                                value={settings.general.storeDescription}
                                onChange={handleSettingsChange}
                                className="input-field"
                                placeholder="A brief description of your coffee shop for the homepage."
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '0.5rem' }}>Business Hours ⏰</h3>
                            <div className="grid-2">
                                {daysOfWeek.map(day => (
                                    <div key={day}>
                                        <label htmlFor={`${day}-hours`}>{day}</label>
                                        <input
                                            type="text"
                                            id={`${day}-hours`}
                                            value={settings.general.businessHours[day] || ''}
                                            onChange={handleSettingsChange}
                                            className="input-field"
                                            placeholder="e.g., 9 AM - 5 PM"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <hr style={{ border: 'none', height: '1px', backgroundColor: '#d1d5db', margin: '2rem 0' }} />

                {/* Product Management Card */}
                <section id="product-management" className="card">
                    <h2>Product Management 📦</h2>
                    <p>Add, edit, or remove products from your online store.</p>
                    <div className="form-section">
                        <form id="product-form" onSubmit={handleProductSubmit} className="form-section">
                            <input type="hidden" id="id" value={productForm.id || ''} />
                            <div className="form-group">
                                <label htmlFor="name">Product Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={productForm.name}
                                    onChange={handleProductFormChange}
                                    className="input-field"
                                    placeholder="e.g., Organic Guatemalan Roast"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    rows="2"
                                    value={productForm.description}
                                    onChange={handleProductFormChange}
                                    className="input-field"
                                    placeholder="Tasting notes, roast level, origin..."
                                    required
                                ></textarea>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label htmlFor="price">Price ($)</label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={productForm.price}
                                        onChange={handleProductFormChange}
                                        className="input-field"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock">Stock Quantity</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        value={productForm.stock}
                                        onChange={handleProductFormChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="imageUrl">Image URL</label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    value={productForm.imageUrl}
                                    onChange={handleProductFormChange}
                                    className="input-field"
                                    placeholder="https://placehold.co/100x100?text=Coffee"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                    type="submit"
                                    className="button primary"
                                >
                                    {productForm.id ? 'Update Product' : 'Add Product'}
                                </button>
                                {productForm.id && (
                                    <button
                                        type="button"
                                        onClick={() => setProductForm({ id: null, name: '', description: '', price: '', stock: '', imageUrl: '' })}
                                        className="button secondary"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        <div id="product-list" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6c4b38' }}>Current Products</h3>
                            {settings.products.length === 0 ? (
                                <p className="empty-list">No products added yet. Add your first coffee product above! ☕</p>
                            ) : (
                                settings.products.map(product => (
                                    <div key={product.id} className="product-item">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="product-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100?text=Image+Error" }}
                                        />
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                            <p className="details">Price: ${product.price.toFixed(2)} | Stock: {product.stock}</p>
                                        </div>
                                        <div className="product-actions">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="button edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="button delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <hr style={{ border: 'none', height: '1px', backgroundColor: '#d1d5db', margin: '2rem 0' }} />

                {/* E-commerce and Ordering Settings Card */}
                <section id="ecommerce-settings" className="card">
                    <h2>Online Ordering Settings 🛒</h2>
                    <p>Configure options for online orders and customer pickup.</p>
                    <div className="form-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="onlineOrdering"
                                checked={settings.ecommerce.onlineOrdering}
                                onChange={e => handleSettingsChange({ target: { id: 'onlineOrdering', type: 'checkbox', checked: e.target.checked } })}
                                style={{ height: '1.25rem', width: '1.25rem', color: '#9c7b5a', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                            />
                            <label htmlFor="onlineOrdering" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Enable Online Ordering</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pickupInstructions">Pickup Instructions</label>
                            <textarea
                                id="pickupInstructions"
                                rows="2"
                                value={settings.ecommerce.pickupInstructions}
                                onChange={handleSettingsChange}
                                className="input-field"
                                placeholder="e.g., Orders ready in 15 mins. Pickup at the counter."
                            ></textarea>
                        </div>
                    </div>
                </section>

                <hr style={{ border: 'none', height: '1px', backgroundColor: '#d1d5db', margin: '2rem 0' }} />

                <div className="save-button-container">
                    <button
                        onClick={handleSaveAllSettings}
                        className="save-button"
                    >
                        Save All Settings
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
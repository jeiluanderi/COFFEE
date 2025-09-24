import React, { useContext, useState, useEffect } from 'react';
import Spinner from '../components/Shared/Spinner.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Fake Payment Modal Component
const PaymentModal = ({ onPay }) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="mb-3">Simulated Payment</h4>
        <p>This is a test payment. Click "Pay Now" to confirm a paid order, or "Cancel" to simulate a failed payment.</p>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-success" onClick={() => onPay(true)}>Pay Now</button>
          <button className="btn btn-danger" onClick={() => onPay(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const { cartItems, totalItems, totalPrice, removeItem, updateItemQuantity, clearCart } = useContext(CartContext);
  const { user, isLoggedIn, token } = useAuth();

  const [checkoutData, setCheckoutData] = useState({
    address: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const handleCheckoutChange = (e) => {
    const { id, value } = e.target;
    setCheckoutData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    primary: '#8B4513',
    secondary: '#6F4E37',
    light: '#F8F5EB',
    dark: '#36220B'
  };

  if (loading) {
    return <Spinner />;
  }

  const getNumericPrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!isLoggedIn || !token) {
      setMessage('You must be logged in to place an order.');
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }

    if (!user || !user.username || !user.email) {
      setMessage('User information missing. Please log in again.');
      return;
    }

    setShowPaymentModal(true); // Open mock payment modal
  };

  // Step 2: Handle payment result and send order to backend
  const handlePayment = async (paid) => {
    setShowPaymentModal(false);
    setIsSubmitting(true);

    const validCartItems = cartItems.filter(item => item.id);

    if (validCartItems.length === 0) {
      setMessage('Your cart contains invalid items. Please refresh and try again.');
      setIsSubmitting(false);
      return;
    }

    // Determine payment status based on user's action
    const paymentStatus = paid ? 'paid' : 'unpaid';

    try {
      const orderPayload = {
        customerName: user.username,
        customerEmail: user.email,
        totalPrice: totalPrice,
        cartItems: validCartItems.map(item => ({
          coffee_id: item.id,
          quantity: item.quantity,
          price: getNumericPrice(item.price)
        })),
        shipping_address: checkoutData.address,
        phone_number: checkoutData.phone,
        payment_status: paymentStatus
      };

      const response = await axios.post(
        `${backendUrl}/api/orders`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMessage(response.data.message || 'Order placed successfully!');
        clearCart();
        setCheckoutData({ address: '', phone: '' });
      } else {
        setMessage('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'Failed to place order. Please try again.');
      } else {
        setMessage('Network error. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showPaymentModal && (
        <PaymentModal
          onPay={handlePayment}
        />
      )}

      <div className="container-xxl py-5" style={{ backgroundColor: colors.light }}>
        <style jsx="true">{`
          .btn-brown-custom {
            background-color: ${colors.primary};
            color: ${colors.light};
            border: none;
            transition: background-color 0.3s, transform 0.3s;
          }
          .btn-brown-custom:hover {
            background-color: ${colors.secondary};
            transform: translateY(-2px);
          }
        `}</style>
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h2 className="display-6" style={{ color: colors.dark }}>Your cart is empty.</h2>
              <p className="fs-5" style={{ color: colors.secondary }}>
                Add some of our delicious coffee to your cart!
              </p>
              <Link to="/menu" className="btn btn-brown-custom py-3 px-5 mt-4">
                Browse Our Menu
              </Link>
            </div>
          ) : (
            <div className="row g-5">
              {/* Shopping Cart Items Section */}
              <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
                <h4 className="mb-4" style={{ color: colors.dark }}>Your Items</h4>
                {cartItems.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-4 border p-3 rounded" style={{ backgroundColor: '#fff' }}>
                    <img className="img-fluid rounded me-3" src={item.image_url} style={{ width: 80, height: 80, objectFit: 'cover' }} alt={item.name} />
                    <div className="flex-grow-1">
                      <h5 className="mb-1" style={{ color: colors.dark }}>{item.name}</h5>
                      <small className="text-muted">Price: ${getNumericPrice(item.price).toFixed(2)}</small>
                      <div className="d-flex align-items-center mt-2">
                        <button className="btn btn-sm btn-brown-custom me-2" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="fw-bold" style={{ color: colors.dark }}>{item.quantity}</span>
                        <button className="btn btn-sm btn-brown-custom ms-2" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                ))}
              </div>

              {/* Cart Summary & Checkout Form Section */}
              <div className="col-lg-4 wow fadeInUp" data-wow-delay="0.2s">
                <div className="p-4 rounded" style={{ backgroundColor: '#f5f5f5' }}>
                  <h4 className="mb-4" style={{ color: colors.dark }}>Cart Summary</h4>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: colors.secondary }}>Subtotal ({totalItems} items):</span>
                    <span className="fw-bold" style={{ color: colors.dark }}>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <span style={{ color: colors.secondary }}>Shipping:</span>
                    <span className="fw-bold" style={{ color: colors.dark }}>Free</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-3 mb-4">
                    <h5 style={{ color: colors.dark }}>Total:</h5>
                    <h5 style={{ color: colors.primary }}>${totalPrice.toFixed(2)}</h5>
                  </div>
                  {message && (
                    <div className="alert alert-info" role="alert">
                      {message}
                    </div>
                  )}

                  {/* Checkout Form */}
                  <h5 className="mb-3" style={{ color: colors.dark }}>Checkout Information</h5>
                  <form onSubmit={handleCheckoutSubmit}>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label" style={{ color: colors.secondary }}>Shipping Address</label>
                      <input
                        type="text"
                        id="address"
                        className="form-control"
                        value={checkoutData.address}
                        onChange={handleCheckoutChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="phone" className="form-label" style={{ color: colors.secondary }}>Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        className="form-control"
                        value={checkoutData.phone}
                        onChange={handleCheckoutChange}
                        required
                      />
                    </div>
                    <button className="btn btn-brown-custom w-100" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Placing Order...' : 'Proceed to Checkout'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;

import React from 'react';

// Component to render a single order list
const OrderList = ({ orders }) => {
    return (
        <div className="space-y-6">
            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders have been submitted yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Order #{order.id}</h3>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        <div className="text-gray-600 space-y-2">
                            <p>
                                <strong>Customer:</strong> {order.customer_name} ({order.customer_email})
                            </p>
                            <p>
                                <strong>Total Price:</strong> ${order.total_price.toFixed(2)}
                            </p>
                            <p>
                                <strong>Shipping Address:</strong> {order.shipping_address}
                            </p>
                            <p>
                                <strong>Phone:</strong> {order.phone_number}
                            </p>
                            <p className="text-sm text-gray-500">
                                Ordered on: {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {(Array.isArray(order.items) ? order.items : []).map((item) => (
                                    <li key={item.id}>
                                        {item.quantity} x {item.coffee_name} - ${item.price_at_time_of_order.toFixed(2)} each
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderList;

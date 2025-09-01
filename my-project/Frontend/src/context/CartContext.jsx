import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a new context for the cart.
export const CartContext = createContext();

// Create a custom hook for easy access to the cart context.
export const useCart = () => useContext(CartContext);

// The provider component that manages and provides cart state.
export const CartProvider = ({ children }) => {
    // Initialize cart state from localStorage.
    // The functional updater ensures this runs only once on initial render.
    // A try...catch block is used to handle potential parsing errors from localStorage.
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('coffee_cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Failed to parse cartItems from localStorage", error);
            return [];
        }
    });

    // State for the total number of items and the total price.
    // These values are calculated in the useEffect hook below.
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // This effect runs whenever cartItems changes.
    // It is responsible for calculating totals and saving the cart to localStorage.
    useEffect(() => {
        const calculateTotals = () => {
            // Calculate the total item count by summing up quantities.
            const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

            // Calculate the total price by summing up the price of each item * its quantity.
            // parseFloat is used as a safeguard to ensure prices are treated as numbers.
            const priceSum = cartItems.reduce((acc, item) => {
                const numericPrice = parseFloat(item.price) || 0;
                return acc + (numericPrice * item.quantity);
            }, 0);

            // Update the state with the newly calculated totals.
            setTotalItems(itemCount);
            setTotalPrice(priceSum);
        };

        // Call the function to calculate and update totals.
        calculateTotals();

        // Save the current cart state to localStorage for persistence.
        localStorage.setItem('coffee_cart', JSON.stringify(cartItems));
    }, [cartItems]); // Dependency array: this effect re-runs only when cartItems changes.

    // Function to add a new item or increment the quantity of an existing one.
    const addItem = (item, quantity = 1) => {
        setCartItems(prevItems => {
            // Check if the item already exists in the cart.
            const existingItemIndex = prevItems.findIndex(i => i.id === item.id);

            // Prepare the item to be added, ensuring the price is a number.
            const itemToAdd = {
                ...item,
                price: parseFloat(item.price) || 0
            };

            // If the item exists, create a new array with the updated quantity.
            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + quantity
                };
                return newItems;
            } else {
                // If the item is new, add it to the end of the array.
                return [...prevItems, { ...itemToAdd, quantity }];
            }
        });
    };

    // Function to remove an item from the cart by its ID.
    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Function to update the quantity of a specific item.
    const updateItemQuantity = (id, newQuantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0); // Remove items with quantity <= 0.
        });
    };

    // Function to clear the entire cart.
    const clearCart = () => {
        setCartItems([]);
    };

    // The value object provided to consuming components.
    // It contains the cart state and all the functions to modify it.
    const cartContextValue = {
        cartItems,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};

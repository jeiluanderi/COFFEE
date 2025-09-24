const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// This module exports a function that accepts the PostgreSQL pool instance.
// This is the correct way to share the database connection with the router.
module.exports = (pool) => {
    // Helper function to fetch the single settings record from the database.
    // It handles the case where no record exists by returning a default structure.
    const getSettingsFromDb = async (client) => {
        const query = 'SELECT general_data, ecommerce_data, products_data FROM settings WHERE id = 1';
        const result = await client.query(query);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        // If no settings exist, return a default structure for initialization.
        // In a real application, you might create a new record here.
        return {
            general_data: {},
            ecommerce_data: {},
            products_data: []
        };
    };

    /**
     * @route  GET /
     * @desc   Get all admin settings.
     * @access Public
     *
     * This route fetches all settings data from the database and returns it
     * in a structured JSON format for the frontend.
     */
    router.get('/', async (req, res) => {
        let client;
        try {
            client = await pool.connect();
            const settings = await getSettingsFromDb(client);
            // Re-structure the data to match the frontend's expected format.
            const formattedSettings = {
                general: settings.general_data,
                ecommerce: settings.ecommerce_data,
                products: settings.products_data
            };
            res.status(200).json(formattedSettings);
        } catch (error) {
            console.error('Error fetching settings:', error.stack);
            res.status(500).json({ error: 'Failed to fetch settings' });
        } finally {
            if (client) client.release();
        }
    });

    /**
     * @route  PUT /
     * @desc   Update general and ecommerce settings.
     * @access Public (in this example)
     *
     * This route handles updating the general and ecommerce settings.
     * It merges the incoming data with the existing settings to ensure no data is lost.
     */
    router.put('/', async (req, res) => {
        const { general, ecommerce } = req.body;
        let client;
        try {
            client = await pool.connect();
            const currentSettings = await getSettingsFromDb(client);

            const updatedGeneral = { ...currentSettings.general_data, ...general };
            const updatedEcommerce = { ...currentSettings.ecommerce_data, ...ecommerce };

            const query = 'UPDATE settings SET general_data = $1, ecommerce_data = $2 WHERE id = 1';
            await client.query(query, [updatedGeneral, updatedEcommerce]);

            res.status(200).json({ message: 'Settings updated successfully.' });
        } catch (error) {
            console.error('Error updating settings:', error.stack);
            res.status(500).json({ error: 'Failed to update settings.' });
        } finally {
            if (client) client.release();
        }
    });

    /**
     * @route  POST /products
     * @desc   Add a new product.
     * @access Public (in this example)
     *
     * This route adds a new product to the `products_data` array.
     */
    router.post('/products', async (req, res) => {
        const { product } = req.body;
        let client;
        try {
            client = await pool.connect();
            const currentSettings = await getSettingsFromDb(client);
            const updatedProducts = [...currentSettings.products_data, product];
            const query = 'UPDATE settings SET products_data = $1 WHERE id = 1';
            await client.query(query, [updatedProducts]);
            res.status(201).json({ message: 'Product added successfully.' });
        } catch (error) {
            console.error('Error adding product:', error.stack);
            res.status(500).json({ error: 'Failed to add product.' });
        } finally {
            if (client) client.release();
        }
    });

    /**
     * @route  PUT /products/:id
     * @desc   Update an existing product.
     * @access Public (in this example)
     *
     * This route updates a single product within the `products_data` array based on its ID.
     */
    router.put('/products/:id', async (req, res) => {
        const { id } = req.params;
        const updatedProduct = req.body.product;
        let client;
        try {
            client = await pool.connect();
            const currentSettings = await getSettingsFromDb(client);
            const productList = currentSettings.products_data.map(p =>
                p.id === id ? updatedProduct : p
            );

            const query = 'UPDATE settings SET products_data = $1 WHERE id = 1';
            await client.query(query, [productList]);
            res.status(200).json({ message: 'Product updated successfully.' });
        } catch (error) {
            console.error('Error updating product:', error.stack);
            res.status(500).json({ error: 'Failed to update product.' });
        } finally {
            if (client) client.release();
        }
    });

    /**
     * @route  DELETE /products/:id
     * @desc   Delete a product.
     * @access Public (in this example)
     *
     * This route deletes a product from the `products_data` array based on its ID.
     */
    router.delete('/products/:id', async (req, res) => {
        const { id } = req.params;
        let client;
        try {
            client = await pool.connect();
            const currentSettings = await getSettingsFromDb(client);
            const updatedProducts = currentSettings.products_data.filter(p => p.id !== id);

            const query = 'UPDATE settings SET products_data = $1 WHERE id = 1';
            await client.query(query, [updatedProducts]);
            res.status(200).json({ message: 'Product deleted successfully.' });
        } catch (error) {
            console.error('Error deleting product:', error.stack);
            res.status(500).json({ error: 'Failed to delete product.' });
        } finally {
            if (client) client.release();
        }
    });

    return router;
};

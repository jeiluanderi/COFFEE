// settingsAdminRoutes.js

const express = require('express');
const router = express.Router();
// No need to require pg or initialize a new pool here.

module.exports = (pool) => {
    router.route('/') // This is the correct base path for the router
        .get(async (req, res) => {
            try {
                // Fetch general settings from the 'shop_settings' table
                const result = await pool.query('SELECT * FROM shop_settings WHERE id = 1');
                const settingsData = result.rows[0] || {};

                // Fetch product list from the 'products' table
                const productResult = await pool.query('SELECT * FROM products ORDER BY id ASC');
                const productsRows = productResult.rows;

                // Format data to match the frontend state structure
                const responseData = {
                    general: {
                        storeName: settingsData.store_name,
                        storeDescription: settingsData.store_description,
                        businessHours: settingsData.business_hours || {},
                    },
                    ecommerce: {
                        onlineOrdering: settingsData.online_ordering,
                        pickupInstructions: settingsData.pickup_instructions,
                    },
                    userProfile: {
                        name: settingsData.user_profile_name,
                        email: settingsData.user_profile_email,
                        phoneNumber: settingsData.user_profile_phone_number,
                    },
                    notifications: {
                        promotions: settingsData.promotions_enabled,
                        securityAlerts: settingsData.security_alerts_enabled,
                    },
                    security: {
                        is2FAEnabled: settingsData.is_2fa_enabled,
                    },
                    display: {
                        theme: settingsData.theme,
                    },
                    localization: {
                        language: settingsData.language,
                        timeZone: settingsData.time_zone,
                    },
                    products: productsRows
                };

                res.status(200).json(responseData);
            } catch (error) {
                console.error('Error fetching settings:', error);
                res.status(500).send('Failed to fetch settings');
            }
        })
        .post(async (req, res) => {
            const { settings, products, action } = req.body;
            
            try {
                switch (action) {
                    case 'saveAllSettings':
                        if (settings) {
                            const { general, ecommerce, userProfile, notifications, security, display, localization } = settings;
                            const sql = `UPDATE shop_settings SET
                                store_name = $1,
                                store_description = $2,
                                business_hours = $3,
                                online_ordering = $4,
                                pickup_instructions = $5,
                                user_profile_name = $6,
                                user_profile_email = $7,
                                user_profile_phone_number = $8,
                                promotions_enabled = $9,
                                security_alerts_enabled = $10,
                                is_2fa_enabled = $11,
                                theme = $12,
                                language = $13,
                                time_zone = $14
                                WHERE id = 1`;
                            
                            const values = [
                                general.storeName,
                                general.storeDescription,
                                general.businessHours,
                                ecommerce.onlineOrdering,
                                ecommerce.pickupInstructions,
                                userProfile.name,
                                userProfile.email,
                                userProfile.phoneNumber,
                                notifications.promotions,
                                notifications.securityAlerts,
                                security.is2FAEnabled,
                                display.theme,
                                localization.language,
                                localization.timeZone
                            ];

                            await pool.query(sql, values);
                            return res.status(200).send('All settings updated successfully');
                        }
                        break;
                    case 'add':
                        if (products && products.length > 0) {
                            const { name, description, price, stock, imageUrl } = products[0];
                            const sql = 'INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5)';
                            const values = [name, description, price, stock, imageUrl];
                            await pool.query(sql, values);
                            return res.status(200).send('Product added successfully');
                        }
                        break;
                    case 'update':
                        if (products && products.length > 0) {
                            const { id, name, description, price, stock, imageUrl } = products[0];
                            const sql = 'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6';
                            const values = [name, description, price, stock, imageUrl, id];
                            await pool.query(sql, values);
                            return res.status(200).send('Product updated successfully');
                        }
                        break;
                    case 'delete':
                        if (products && products.length > 0) {
                            const { id } = products[0];
                            const sql = 'DELETE FROM products WHERE id = $1';
                            const values = [id];
                            await pool.query(sql, values);
                            return res.status(200).send('Product deleted successfully');
                        }
                        break;
                    default:
                        return res.status(400).send('Invalid action specified');
                }
            } catch (error) {
                console.error('Error processing request:', error);
                res.status(500).send('Failed to process request');
            }
        });
    return router;
};
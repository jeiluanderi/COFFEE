// // routes/contactRoutes.js

// const express = require('express');
// const router = express.Router();

// // The file now exports a function that receives the 'pool' connection as an argument
// module.exports = (pool) => { 
    
//     // @route   GET /api/contact
//     // @desc    Get public contact information
//     // @access  Public
//     router.get('/', async (req, res) => {
//         try {
//             // We assume contact info is stored in the 'shop_settings' table
//             const result = await pool.query(
//                 // Select only the public contact fields you need
//                 'SELECT store_name, business_hours, contact_email, contact_phone, address, social_links FROM shop_settings WHERE id = 1'
//             );

//             if (result.rows.length === 0) {
//                 // If the shop settings table is empty
//                 return res.status(404).json({ message: 'Contact settings not configured.' });
//             }

//             // Return the first row of settings
//             res.json(result.rows[0]);
//         } catch (err) {
//             console.error('❌ Error fetching contact information:', err);
//             res.status(500).json({ error: 'Failed to retrieve contact information.' });
//         }
//     });

//     return router;
// };
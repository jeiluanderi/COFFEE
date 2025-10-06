const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// =======================
// GET /profile - Authenticated User
// =======================
router.get('/', authenticateToken, (req, res) => {
    const { password_hash, ...userWithoutHash } = req.user;
    res.json({
        message: 'User profile retrieved successfully',
        user: userWithoutHash
    });
});

module.exports = router;
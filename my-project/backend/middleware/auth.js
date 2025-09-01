// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

// Authentication Middleware: Verifies the JWT token from the 'Authorization' header.
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ error: 'Authentication failed. Token is missing.' });
    }

    // Get JWT_SECRET from app settings (set in server.js)
    const JWT_SECRET = req.app.get('jwtSecret');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Log error for debugging purposes (e.g., TokenExpiredError, JsonWebTokenError)
            console.error("JWT verification error:", err.message);
            return res.status(403).json({ error: 'Authentication failed. Invalid or expired token.' });
        }
        req.user = user; // Attach the decoded user payload to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Authorization Middleware: Checks if the authenticated user has one of the allowed roles.
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If req.user is not set (i.e., authenticateToken failed or wasn't used),
        // or if the user's role is not in the allowedRoles list, return 403 Forbidden.
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
        }
        next(); // User has the required role, proceed.
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
};

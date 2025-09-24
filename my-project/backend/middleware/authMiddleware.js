const jwt = require('jsonwebtoken');

// Change function name from authenticateJWT to authenticateToken
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // This is the line that returns "Invalid token"
            console.error("JWT verification failed:", err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Role-based authorization
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission.' });
        }
        next();
    };
}

// Export authenticateToken
module.exports = { authenticateToken, authorizeRoles };
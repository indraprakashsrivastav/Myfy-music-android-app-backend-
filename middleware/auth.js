const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    // Token should be in the format "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Add decoded user information to the request object
        next();  // Pass control to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticate;

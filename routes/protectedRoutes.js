const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// Example protected route
router.get('/protected', authenticate, (req, res) => {
    res.send(`Hello ${req.user.userId}, this is a protected route.`);
});

module.exports = router;

// index.js
require('dotenv').config();  // Ensure environment variables are loaded

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Add CORS support
const app = express();

const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(cors());  // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Use routes
app.use('/api/auth', require('./routes/auth'));       // User authentication routes
app.use('/api/playlists', require('./routes/playlists')); // Playlist management routes
app.use('/api/songs', require('./routes/songs'));     // Song routes
app.use('/api/search', require('./routes/search'));   // Search tracks routes

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

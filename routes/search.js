// routes/search.js
const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService'); // Adjust path if needed

// Route handler for searching tracks
router.get('/', async (req, res) => {
    console.log('Search route hit'); // Log to confirm the route is hit

    const { query } = req.query; // Get the search query from the request
    console.log('Search query:', query); // Log the search query

    try {
        const tracks = await spotifyService.searchTracks(query);
        console.log('Search results:', tracks); // Log the search results
        res.json(tracks); // Return the search results as JSON
    } catch (error) {
        console.error('Error searching for tracks:', error); // Log any errors
        res.status(500).json({ error: 'Failed to search for tracks' });
    }
});

module.exports = router;

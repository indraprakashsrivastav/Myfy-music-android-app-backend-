const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const authenticate = require('../middleware/auth'); // Ensure you have this middleware for authentication
const mongoose = require('mongoose'); 

// Create a playlist
router.post('/', authenticate, async (req, res) => {
    console.log('Create playlist route hit');
    console.log('Request body:', req.body);

    const { name, description } = req.body;
    const user = req.user.userId; // User ID from JWT token

    try {
        const playlist = new Playlist({ name, description, user });
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        console.error('Error during playlist creation:', error.message);  // Detailed error message
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all playlists
router.get('/', authenticate, async (req, res) => { // Added authentication middleware here
    console.log('Get all playlists route hit');
    try {
        const playlists = await Playlist.find({ user: req.user.userId }); // Fetch playlists for the authenticated user
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error.message); // Detailed error message
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a single playlist by ID
router.get('/:id', authenticate, async (req, res) => {
    console.log('Get playlist by ID route hit');
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' }); // Check if user has access
        }
        res.json(playlist);
    } catch (error) {
        console.error('Error fetching playlist:', error.message); // Detailed error message
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a song to a playlist
router.patch('/:id/add-song', authenticate, async (req, res) => {
    console.log('Add song to playlist route hit');
    console.log('Request body:', req.body);

    const { id } = req.params;
    const { song } = req.body; // Assume song is an object with song details

    try {
        const playlist = await Playlist.findById(id);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' }); // Check if user has access
        }

        playlist.songs.push(song);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        console.error('Error adding song to playlist:', error.message); // Detailed error message
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove a song from a playlist
router.patch('/:id/remove-song', authenticate, async (req, res) => {
    console.log('Remove song from playlist route hit');
    console.log('Request body:', req.body);

    const { id } = req.params;
    const { songId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid playlist ID format' });
        }
        if (typeof songId !== 'string') {
            return res.status(400).json({ error: 'Invalid song ID format' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        playlist.songs = playlist.songs.filter(song => song._id.toString() !== songId);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        console.error('Error removing song from playlist:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a playlist by ID
router.delete('/:id', authenticate, async (req, res) => {
    console.log('Delete playlist route hit');
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' }); // Check if user has access
        }

        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error('Error deleting playlist:', error.message); // Detailed error message
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

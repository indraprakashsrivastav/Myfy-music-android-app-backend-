const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Create a song
router.post('/', async (req, res) => {
    const { title, artist, album, duration, releaseDate, spotifyId, audioUrl, imgUrl } = req.body;
    try {
        const song = new Song({ title, artist, album, duration, releaseDate, spotifyId, audioUrl, imgUrl });
        await song.save();
        res.status(201).json(song);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a single song by ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ error: 'Song not found' });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a song by ID
router.delete('/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) return res.status(404).json({ error: 'Song not found' });
        res.json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

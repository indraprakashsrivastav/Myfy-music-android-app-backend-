const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: String,
    duration: Number,
    releaseDate: Date,
    spotifyId: { type: String, unique: true } // to store the Spotify track ID
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

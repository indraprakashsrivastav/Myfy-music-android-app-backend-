// models/Playlist.js
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] // Change back to ObjectId
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

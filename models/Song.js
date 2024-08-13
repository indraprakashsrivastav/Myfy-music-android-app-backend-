// models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    duration: { type: Number },
    releaseDate: { type: Date },
    spotifyId: { type: String, required: true },
    audioUrl: { type: String }, // URL for the audio file
    imgUrl: { type: String } // URL for the song image
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const mongoose = require('mongoose');
const Song = require('../models/Song'); // Update the path if necessary

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let spotifyToken = null;
let tokenExpirationTime = null;

const getSpotifyToken = async () => {
    if (spotifyToken && tokenExpirationTime && new Date() < tokenExpirationTime) {
        return spotifyToken;
    }

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            qs.stringify({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        spotifyToken = response.data.access_token;
        const expiresIn = response.data.expires_in; 
        tokenExpirationTime = new Date(new Date().getTime() + expiresIn * 1000);

        return spotifyToken;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        throw error;
    }
};

const fetchSpotifySong = async (spotifyId) => {
    const accessToken = await getSpotifyToken();

    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const { name, artists, album, duration_ms, release_date } = response.data;
        const song = new Song({
            title: name,
            artist: artists[0].name,
            album: album.name,
            duration: duration_ms,
            releaseDate: release_date,
            spotifyId
        });
        await song.save();

        console.log('Song saved:', song);
        return song;
    } catch (error) {
        console.error('Error fetching Spotify song:', error);
        throw error;
    }
};

// Replace with the Spotify track ID you want to test
const spotifyId = '1eZefeDb8uOsjvcbl1fJrG'; // Example ID

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        return fetchSpotifySong(spotifyId);
    })
    .catch(err => console.error('MongoDB connection error:', err));

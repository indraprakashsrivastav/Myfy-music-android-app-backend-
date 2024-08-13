const axios = require('axios');
const qs = require('qs');
const Song = require('../models/Song');

let spotifyToken = null;
let tokenExpirationTime = null;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

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
        console.error('Error fetching Spotify access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const fetchSpotifySong = async (spotifyId) => {
    try {
        const accessToken = await getSpotifyToken();

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
            spotifyId,
            imageUrl: track.album.images[0]?.url || '',  // Get the largest image URL
            audioUrl: track.preview_url || ''  // Preview URL
        });
        await song.save();

        return song;
    } catch (error) {
        console.error('Error fetching song:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// New function to search for tracks
const searchTracks = async (query) => {
    try {
        const accessToken = await getSpotifyToken();

        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                q: query,
                type: 'track'
            }
        });

        return response.data.tracks.items; // Return the list of tracks found
    } catch (error) {
        console.error('Error searching for tracks:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { fetchSpotifySong, searchTracks };

require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');
const qs = require('qs');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

console.log('CLIENT_ID:', client_id); // Debugging
console.log('CLIENT_SECRET:', client_secret); // Debugging

if (!client_id || !client_secret) {
    console.error('CLIENT_ID and CLIENT_SECRET must be defined in the .env file');
    process.exit(1);
}

const authString = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const getSpotifyToken = async () => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            qs.stringify({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
    }
};

getSpotifyToken();

const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config()

const googleOAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

module.exports = googleOAuth2Client;

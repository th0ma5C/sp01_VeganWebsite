const { google } = require('googleapis');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = `.env.${NODE_ENV}`;
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
} else {
    dotenv.config();
}

const jwtSecret = process.env.JWT_SECRET
const jwtPayload = {
    client: 'login'
}
const state = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' });

const client = new google.auth.OAuth2(
    process.env.LOGIN_CLIENT_ID,
    process.env.LOGIN_CLIENT_SECRET,
    process.env.LOGIN_REDIRECT_URI
);

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state
});

function getAuthUrl() {
    return authUrl
}

module.exports = {
    client,
    getAuthUrl
};

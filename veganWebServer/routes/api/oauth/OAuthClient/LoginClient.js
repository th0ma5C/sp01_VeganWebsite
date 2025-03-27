const { google } = require('googleapis');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const jwtSecret = process.env.JWT_SECRET
const jwtPayload = {
    client: 'login'
}

const client = new google.auth.OAuth2(
    process.env.LOGIN_CLIENT_ID,
    process.env.LOGIN_CLIENT_SECRET,
    process.env.LOGIN_REDIRECT_URI
);

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

function getAuthUrl() {
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
        state: jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' })
    });
}

module.exports = {
    client,
    getAuthUrl
};

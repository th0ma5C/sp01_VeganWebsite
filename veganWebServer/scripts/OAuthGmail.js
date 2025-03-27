const { google } = require('googleapis');
const dotenv = require('dotenv');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('module-alias/register');
// const client = require('@routes/api/oauth/OAuthClient/MailerClient');

const NODE_ENV = process.env.NODE_ENV || 'production';
const envFile = `.env.${NODE_ENV}`;
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`Loaded environment variables from ${envFile}`);
} else {
    dotenv.config();
    console.warn(`Loaded environment variables from default .env`);
}

const jwtSecret = process.env.JWT_SECRET
const jwtPayload = {
    client: 'nodeMailer'
}
const state = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' });

const SCOPES = [
    'https://mail.google.com/',
];

const client = new google.auth.OAuth2(
    process.env.MAILER_CLIENT_ID,
    process.env.MAILER_CLIENT_SECRET,
    process.env.MAILER_REDIRECT_URI
);

const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state
});


console.log(authUrl);

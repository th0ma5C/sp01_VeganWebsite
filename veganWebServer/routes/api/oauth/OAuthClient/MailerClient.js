const { google } = require('googleapis');
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
// dotenv.config();

const jwtSecret = process.env.JWT_SECRET
const jwtPayload = {
    client: 'nodeMailer'
}

const state = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '1h' });
const googleOAuth2Client = new google.auth.OAuth2(
    process.env.MAILER_CLIENT_ID,
    process.env.MAILER_CLIENT_SECRET,
    process.env.MAILER_REDIRECT_URI
);

module.exports = googleOAuth2Client
const OAuthToken = require('../models/OAuthTokenModel');
const cron = require('node-cron');
const { google } = require('googleapis');

async function refreshGCPToken() {
    try {
        const tokenData = await OAuthToken.findOne();
        const currentTime = new Date();
        const timeToExpiry = tokenData.expiryDate - currentTime;
        if (!tokenData || timeToExpiry <= 5 * 60 * 1000) {
            console.log('Token has expired or does not exist, refreshing...');

            const oAuth2Client = new google.auth.OAuth2(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                process.env.REDIRECT_URI
            );

            oAuth2Client.setCredentials({
                refresh_token: tokenData.refreshToken,
            });

            const newTokens = await oAuth2Client.getAccessToken();
            const { token, res } = newTokens;

            const expiryDate = new Date(Date.now() + res.data.expires_in * 1000);

            await OAuthToken.updateOne({}, {
                accessToken: token,
                expiryDate: expiryDate,
            }, { upsert: true });

            console.log('Token updated successfully');
        } else {
            console.log('Token is still valid');
        }
    } catch (error) {
        console.error('Failed to refresh access token:', error);
    }
}

function scheduleTokenRefresh() {
    cron.schedule('55 * * * *', async () => {
        try {
            console.log('Running cron job to check and refresh OAuth token');
            await refreshGCPToken();
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports = scheduleTokenRefresh;
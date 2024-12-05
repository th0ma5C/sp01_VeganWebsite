const cron = require('node-cron');
const googleOAuth2Client = require('../config/googleOAth2Client');
const OAuthToken = require('../models/OAuthTokenModel');

async function refreshGCPToken() {
    console.log('checking GCP token');
    try {
        const tokenData = await OAuthToken.findOne();
        const currentTime = new Date();
        const timeToExpiry = tokenData.expiryDate - currentTime;
        if (!tokenData || timeToExpiry <= 60 * 60 * 10000) {
            console.log('Token has expired or does not exist, refreshing...');
            googleOAuth2Client.setCredentials({
                refresh_token: tokenData.refreshToken,
            });

            googleOAuth2Client.on('tokens', (tokens) => {
                if (tokens.refresh_token) {
                    // store the refresh_token in my database!
                    console.log(tokens.refresh_token);
                }
                console.log(tokens.access_token);
            });
            const { token, res: { data: { expiry_date } } } = await googleOAuth2Client.getAccessToken();
            tokenData.accessToken = token;
            tokenData.expiryDate = new Date(expiry_date);
            await tokenData.save();

            console.log('Token updated successfully');
        } else {
            console.log('GCP token not expired');
        }
    } catch (error) {
        console.error('Failed to refresh access token:', error);
    }
}

async function scheduleTokenRefresh() {
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('Running cron job to check and refresh OAuth token');
            await refreshGCPToken();
        } catch (error) {
            console.log(error);
        }
    });
}

async function autoRefreshToken() {
    try {
        const tokenData = await OAuthToken.findOne();
        googleOAuth2Client.setCredentials({
            refresh_token: tokenData.refreshToken,
        });
        googleOAuth2Client.on('tokens', async (tokens) => {
            try {
                if (tokens.refresh_token) {
                    console.log('new Refresh Token:', tokens.refresh_token);
                }
                console.log('new Access Token:', tokens.access_token);
                tokenData.accessToken = tokens.access_token;
                tokenData.expiryDate = new Date(expiry_date);
                await tokenData.save();
            } catch (error) {
                console.error('Failed to save updated tokens:', error);
            }
        })
    } catch (error) {
        console.error('Failed to refresh access token:', error);
    }
}

module.exports = {
    refreshGCPToken,
    scheduleTokenRefresh,
    autoRefreshToken
};
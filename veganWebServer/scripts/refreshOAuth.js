const cron = require('node-cron');
const googleOAuth2Client = require('../config/googleOAth2Client');
const OAuthToken = require('../models/OAuthTokenModel');

async function refreshGCPToken() {
    console.log('checking GCP token');
    try {
        const tokenData = await OAuthToken.findOne();
        const currentTime = new Date();
        const timeToExpiry = tokenData.expiryDate - currentTime;
        if (!tokenData || timeToExpiry <= 60 * 60 * 1000) {
            console.log('Token has expired or does not exist, refreshing...');
            googleOAuth2Client.setCredentials({
                refresh_token: tokenData.refreshToken,
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

module.exports = {
    refreshGCPToken,
    scheduleTokenRefresh
};
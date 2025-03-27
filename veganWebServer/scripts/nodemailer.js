const nodemailer = require('nodemailer');
const OAuthToken = require('@models/OAuthTokenModel');

let transporter;

const initTransporter = async () => {
    try {
        const tokenData = await OAuthToken.findOne()

        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                type: 'OAuth2',
                user: process.env.OAuth_USER,
                clientId: process.env.MAILER_CLIENT_ID,
                clientSecret: process.env.MAILER_CLIENT_SECRET,
                refreshToken: tokenData.refreshToken,
                accessToken: tokenData.accessToken,
            },
        });

        transporter.on('token', async (token) => {
            try {
                tokenData.accessToken = token.accessToken;
                tokenData.expiryDate = new Date(token.expires);
                await tokenData.save();

                console.log('access token refreshed');
            } catch (error) {
                console.error('Failed to refresh access token:', error);
            }
        });

        return transporter;
    } catch (error) {
        console.log(error);
    }
}

initTransporter();

module.exports = {
    getTransporter: () => transporter,
};